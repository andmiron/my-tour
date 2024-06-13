const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const Tour = require('../models/tour.model');
const catchAsync = require('../utils/catch.async');
const User = require('../models/user.model');

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
   const tours = await Tour.find({ guide: req.user._id }).exec();
   res.render('myTours', { title: 'My tours', tours });
});

exports.renderAllUsers = catchAsync(async (req, res) => {
   const users = await User.find().populate({ path: 'tours reviews' }).exec();
   res.render('allUsers', { title: 'Users', users });
});

exports.renderUser = catchAsync(async (req, res) => {
   const guide = await User.findById(req.params.userId).populate({ path: 'tours reviews' }).exec();
   res.render('user', { title: 'User', guide });
});

exports.renderSuccessCheckout = catchAsync(async (req, res) => {
   const { session_id } = req.query;
   const session = await stripe.checkout.sessions.retrieve(session_id);
   res.render('paymentSuccess', { title: 'Success', session: JSON.stringify(session) });
   //    TODO finish redirecting on my bookings page and fill with relative data from session
});
