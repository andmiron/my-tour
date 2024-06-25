const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const Tour = require('../tours/tours.model');
const catchAsync = require('../../utils/catch.async');
const User = require('../users/users.model');
const Booking = require('../bookings/bookings.model');
const Review = require('../reviews/reviews.model');

exports.renderPage = function (template, title) {
   return function (req, res) {
      res.render(template, { title });
   };
};

exports.renderTours = catchAsync(async (req, res) => {
   const tours = await Tour.find().populate({ path: 'ownerId' }).exec();
   res.render('allTours', { title: 'All tours', tours });
});

exports.renderTour = catchAsync(async (req, res) => {
   const { tourSlug: slug } = req.params;
   const tour = await Tour.findOne({ slug })
      .populate({ path: 'ownerId', select: 'email _id' })
      .populate({ path: 'reviews' })
      .exec();
   res.render('tour', { title: tour.name, tour });
});

exports.renderMyTours = catchAsync(async (req, res) => {
   const tours = await Tour.find({ ownerId: req.user._id }).populate({ path: 'ownerId', select: 'photo' }).exec();
   res.render('myTours', { title: 'My tours', tours });
});

exports.renderAllUsers = catchAsync(async (req, res) => {
   const guides = await User.find().populate({ path: 'tours reviews' }).exec();
   res.render('allUsers', { title: 'Users', guides });
});

exports.renderUser = catchAsync(async (req, res) => {
   const guide = await User.findById(req.params.userId).populate({ path: 'tours reviews' }).exec();
   res.render('user', { title: 'User', guide });
});

exports.renderSuccessCheckout = catchAsync(async (req, res) => {
   res.render('paymentSuccess', { title: 'Success' });
});

exports.renderFailureCheckout = catchAsync(async (req, res) => {
   res.render('paymentFailure', { title: 'Failure' });
});

exports.renderMyReviews = catchAsync(async (req, res) => {
   const reviews = await Review.find({ ownerId: req.user.id }).exec();
   res.render('myReviews', { title: 'Reviews', reviews });
});

exports.renderEditTour = catchAsync(async (req, res) => {});

exports.renderMyBookings = catchAsync(async (req, res) => {
   const bookingsData = await Booking.find({ ownerId: req.user.id }).exec();
   const bookings = await Promise.all(
      bookingsData.map(async (booking) => {
         return await stripe.checkout.sessions.retrieve(booking.stripeSessionId);
      }),
   );
   res.render('myBookings', { title: 'My Bookings', bookings });
});
