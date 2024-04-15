const router = require('express').Router();

router.use((req, res, next) => {
   if (req.user) res.locals.user = req.user;
   next();
});

router.get('/', (req, res) => res.render('home', { title: 'Home' }));
router.get('/signup', (req, res) => res.render('signup', { title: 'Sign up' }));
router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.get('/forget', (req, res) => res.render('forgetPassword', { title: 'Forget password' }));
router.get('/reset/:token', (req, res) => res.render('resetPassword', { title: 'Reset password' }));

router.use((req, res, next) => {
   if (!req.user) res.redirect('/login');
   next();
});
router.get('/profile', (req, res) => res.render('profile', { title: 'Profile', user: req.user }));
router.get('/billing', (req, res) => res.render('billing', { title: 'Billing', user: req.user }));
router.get('/my-reviews', (req, res) => res.render('my-reviews', { title: 'My reviews', user: req.user }));
router.get('/my-bookings', (req, res) => res.render('my-bookings', { title: 'My bookings', user: req.user }));
router.get('/my-tours', (req, res) => res.render('my-tours', { title: 'My tours', user: req.user }));

module.exports = router;
