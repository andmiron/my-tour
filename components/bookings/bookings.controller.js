const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const AppError = require('../../common/AppError');
const bookingRepository = require('./booking.repository');
const Booking = require('../bookings/bookings.model');
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
         unit_amount: (tour.price - tour.priceDiscount) * 100,
         currency: 'usd',
      });
      const session = await stripe.checkout.sessions.create({
         line_items: [{ price: tourPrice.id, quantity: 1 }],
         mode: 'payment',
         customer_email: req.user.email,
         success_url: `${req.protocol}://${req.get('host')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${req.protocol}://${req.get('host')}/payment/failure`,
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
                  ownerId: session.metadata.userId,
                  tourId: session.metadata.tourId,
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

   async getMyBookings(req, res) {
      const bookingsQuery = bookingRepository.getMany({ ownerId: req.user.id });
      const bookings = await bookingsQuery.populate('tourId').exec();
      res.status(200).send({
         status: 'success',
         data: {
            bookings,
         },
      });
   }

   async getMyBooking(req, res) {
      const booking = await bookingRepository.getOne({ tourId });
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(booking.stripeSessionId, {
         expand: ['line_items'],
      });
   }

   async deleteBooking(req, res) {
      await Booking.deleteBooking(req.params.bookingId);
      res.status(200).send({
         status: 'Booking deleted',
         data: null,
      });
   }
}

module.exports = new BookingsController();
