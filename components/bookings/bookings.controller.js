const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const AppError = require('../../utils/app.error');
const Booking = require('./bookings.model');
const User = require('../users/users.model');

class BookingsController {
   async createCheckoutSession(req, res) {
      const tour = req.body.tour;
      const tourProduct = await stripe.products.create({
         name: `${tour.name} Tour`,
         description: tour.summary,
         images: [`${tour.imageCover}`],
      });
      const tourPrice = await stripe.prices.create({
         product: tourProduct.id,
         unit_amount: tour.price,
         currency: 'usd',
      });
      const session = await stripe.checkout.sessions.create({
         line_items: [{ price: tourPrice.id, quantity: 1 }],
         mode: 'payment',
         customer: req.user.id,
         customer_email: req.user.email,
         client_reference_id: tour.id,
         success_url: `${req.protocol}://${req.get('host')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/checkout/failure`,
      });

      res.status(200).send({
         redirectUrl: session.url,
      });
   }

   async checkoutWebhook(req, res, next) {
      let event;
      try {
         constructStripeEvent();
      } catch (err) {
         throw AppError.badRequest(`Stripe webhook error: ${err.message}`);
      }

      if (event.type === 'checkout.session.completed') {
         await submitPayment();
      }

      function constructStripeEvent() {
         event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET,
         );
      }

      async function submitPayment() {
         const checkoutSession = await stripe.checkout.sessions.retrieve(event.data.object.id);
         const { client_reference_id: tourId, customer_email: email, id: stripeSessionId } = checkoutSession;
         const user = await User.findOne({ email }).exec();
         await Booking.create({ tourId, ownerId: user.id, stripeSessionId });
      }

      res.status(200).end();
   }
}

module.exports = new BookingsController();
