const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const {
   renderPage,
   renderTours,
   renderTour,
   renderMyTours,
   renderAllUsers,
   renderUser,
   renderSuccessCheckout,
} = require('../controllers/view.controller');

router.use((req, res, next) => {
   if (req.user) res.locals.user = req.user;
   next();
});

router.get('/', renderPage('home', 'Home'));
router.get('/signup', renderPage('signup', 'Signup'));
router.get('/login', renderPage('login', 'Login'));
router.get('/forget', renderPage('forgetPassword', 'Forget password'));
router.get('/reset/:token', renderPage('resetPassword', 'Reset password'));
router.get('/users', renderAllUsers);
router.get('/users/:userId', renderUser);
router.get('/profile', isAuthenticated, renderPage('profile', 'Profile'));
router.get('/my-reviews', isAuthenticated, renderPage('myReviews', 'My reviews'));
router.get('/my-bookings', isAuthenticated, renderPage('myBookings', 'My bookings'));
router.get('/my-tours', isAuthenticated, renderMyTours);
router.get('/tours/create', isAuthenticated, renderPage('createTour', 'Create tour'));
router.get('/tours', renderTours);
router.get('/tours/:tourSlug', renderTour);
router.get('/payment/success', renderSuccessCheckout);

module.exports = router;
