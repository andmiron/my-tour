const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const AppError = require('../../common/AppError');
const bookingRepository = require('./booking.repository');
const { sendMail } = require('../../services/email');

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
         customer_email: req.user.email,
         success_url: `${req.protocol}://${req.get('host')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/checkout/failure`,
         metadata: {
            userId: req.user.id,
            tourId: tour.id,
         },
      });

      res.status(200).send({
         redirectUrl: session.url,
      });
   }

   async checkoutWebhook(req, res) {
      let event;
      try {
         event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET,
         );
      } catch (err) {
         throw AppError.badRequest(`Stripe webhook error: ${err.message}`);
      }

      switch (event.type) {
         case 'checkout.session.completed':
            {
               const session = event.data.object;
               const newBooking = await bookingRepository.create({
                  tourId: session.metadata.tourId,
                  ownerId: session.metadata.userId,
                  stripeSessionId: session.id,
               });
               if (session.payment_status === 'paid') {
                  newBooking.isPaid = true;
               }
               await newBooking.save();
            }
            break;
         case 'checkout.session.async_payment_succeeded':
            {
               const session = event.data.object;
               await bookingRepository.getOneAndUpdate({ stripeSessionId: session.id }, { isPaid: true }).exec();
            }
            break;
         case 'checkout.session.async_payment_failed':
            {
               const session = event.data.object;
               await sendMail(
                  session.customer_email,
                  'Payment failed',
                  'Your payment did not come through! Please try again later.',
               );
            }
            break;
      }

      res.status(200).end();
   }
}

module.exports = new BookingsController();
