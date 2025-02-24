const config = require('../../config/config');
const stripe = require('stripe')(config.get('stripe.apiKey'));
const Tour = require('../tours/tours.model');
const User = require('../users/users.model');
const Review = require('../reviews/reviews.model');
const Booking = require('../bookings/bookings.model');

exports.renderPage = function (template, title) {
   return function (req, res) {
      res.render(template, { title });
   };
};

exports.renderTours = async (req, res) => {
   const tours = await Tour.find().exec();
   res.render('allTours', { title: 'All tours', tours });
};

exports.renderTour = async (req, res) => {
   const { slug } = req.params;
   const tour = await Tour.findOne({ slug })
      .populate({ path: 'ownerId', select: 'email _id' })
      .populate({ path: 'reviews', populate: { path: 'ownerId', select: 'photo email' } })
      .populate({ path: 'bookings', populate: { path: 'ownerId', select: 'photo' } })
      .exec();
   res.render('tour', { title: tour.name, tour });
};

exports.renderMyTours = async (req, res) => {
   const tours = await Tour.find({ ownerId: req.user._id }).populate({ path: 'ownerId', select: 'photo' }).exec();
   res.render('myTours', { title: 'My tours', tours });
};

exports.renderAllUsers = async (req, res) => {
   const guides = await User.find().populate({ path: 'tours reviews' }).exec();
   res.render('allUsers', { title: 'Users', guides });
};

exports.renderUser = async (req, res) => {
   const guide = await User.findById(req.params.userId).populate({ path: 'tours reviews' }).exec();
   res.render('user', { title: 'User', guide });
};

exports.renderSuccessCheckout = async (req, res) => {
   res.render('paymentSuccess', { title: 'Success' });
};

exports.renderFailureCheckout = async (req, res) => {
   res.render('paymentFailure', { title: 'Failure' });
};

exports.renderMyReviews = async (req, res) => {
   const reviews = await Review.find({ ownerId: req.user.id })
      .populate({ path: 'ownerId', select: 'email photo' })
      .populate('tourId', 'name slug')
      .exec();
   res.render('myReviews', { title: 'Reviews', reviews });
};

exports.renderEditTour = async (req, res) => {
   res.render('tourEdit', { title: 'Edit tour', tourToEdit: req.body.tourToEdit });
};

exports.renderMyBookings = async (req, res) => {
   const bookingsQuery = Booking.find({ ownerId: req.user.id });
   const bookings = await bookingsQuery.populate('tourId');
   res.render('myBookings', { title: 'My Bookings', bookings });
};
