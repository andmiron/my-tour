const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const catchAsync = require('../utils/catch.async');
const AppError = require('../utils/app.error');

exports.createCheckoutSessionHandler = catchAsync(async (req, res, next) => {
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
      success_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/checkout/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/checkout/failure`,
   });
   res.status(200).send({ redirectTo: session.url });
});

exports.checkoutSuccessHandler = catchAsync(async (req, res) => {
   //    TODO finish success and maybe webhooks to send confirmation email
});
