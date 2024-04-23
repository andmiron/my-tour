const { renderPage } = require('../controllers/view.controller');
const { isAuthenticated } = require('../middlewares/authenticated');
const router = require('express').Router();

router.use((req, res, next) => {
   if (req.user) res.locals.user = req.user;
   next();
});

router.get('/', renderPage('home', 'Home'));
router.get('/signup', renderPage('signup', 'Signup'));
router.get('/login', renderPage('login', 'Login'));
router.get('/forget', renderPage('forgetPassword', 'Forget password'));
router.get('/reset/:token', renderPage('resetPassword', 'Reset password'));
router.get('/profile', isAuthenticated, renderPage('profile', 'Profile'));
router.get('/my-reviews', isAuthenticated, renderPage('myReviews', 'My reviews'));
router.get('/my-bookings', isAuthenticated, renderPage('myBookings', 'My bookings'));
router.get('/my-tours', isAuthenticated, renderPage('myTours', 'My tours'));

module.exports = router;
