const router = require('express').Router();
const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const {
   renderPage,
   renderTours,
   renderTour,
   renderMyTours,
   renderAllUsers,
   renderUser,
   renderSuccessCheckout,
   renderFailureCheckout,
   renderMyBookings,
   renderMyReviews,
   renderEditTour,
} = require('./views.controller');
const ToursValidator = require('../tours/tours.validator');

router.use((req, res, next) => {
   if (req.user) res.locals.user = req.user;
   next();
});

router.get('/', renderPage('home', 'Home'));
router.get('/signup', renderPage('signup', 'Signup'));
router.get('/login', renderPage('login', 'Login'));
router.get('/forget', renderPage('forgetPassword', 'Forget password'));
router.get('/reset/:token', renderPage('resetPassword', 'Reset password'));
router.get('/guides', renderAllUsers);
router.get('/users/:userId', renderUser);
router.get('/my-profile', isAuthenticated, renderPage('myAccount', 'Profile'));
router.get('/my-reviews', isAuthenticated, renderMyReviews);
router.get('/my-bookings', isAuthenticated, renderMyBookings);
router.get('/my-tours', isAuthenticated, renderMyTours);
router.get('/tours/create', isAuthenticated, renderPage('tourCreate', 'Create tour'));
router.get('/tours', renderTours);
router.get('/tours/:slug', ToursValidator.validateGetTour(), ToursValidator.validate, renderTour);
router.get(
   '/tours/edit/:tourId',
   isAuthenticated,
   ToursValidator.validateRenderEditTour(),
   ToursValidator.validate,
   renderEditTour,
);
router.get('/payment/success', renderSuccessCheckout);
router.get('/payment/failure', renderFailureCheckout);

module.exports = router;
