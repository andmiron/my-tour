const router = require('express').Router();

router.get('/', (req, res) => res.render('home', { title: 'Home' }));
router.get('/signup', (req, res) => res.render('signup', { title: 'Sign up' }));
router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.get('/forget', (req, res) => res.render('forgetPassword', { title: 'Forget password' }));
router.get('/reset/:token', (req, res) => res.render('resetPassword', { title: 'Reset password' }));
router.get('/profile', (req, res) => res.render('profile', { title: 'Profile', user: req.user }));

module.exports = router;
