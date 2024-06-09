const {
   signupValidator,
   validate,
   loginValidator,
   forgetPasswordValidator,
   resetPasswordValidator,
} = require('../middlewares/validate');
const {
   signupHandler,
   loginHandler,
   logoutHandler,
   forgetPasswordHandler,
   resetPasswordHandler,
} = require('../controllers/auth.contoller');
const passport = require('passport');
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const router = require('express').Router();

router.post('/signup', signupValidator(), validate, signupHandler);
router.post('/login', loginValidator(), validate, passport.authenticate('local'), loginHandler);
router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get(
   '/google/callback',
   passport.authenticate('google', {
      successRedirect: '/api/v1/auth/google/success',
      failureRedirect: '/api/v1/auth/google/failure',
   }),
);
router.get('/google/success', isAuthenticated, (req, res) => res.render('googleAuthSuccess'));
router.get('/google/failure', (req, res) => res.render('googleAuthFailure'));
router.post('/logout', isAuthenticated, logoutHandler);
router.post('/forget', forgetPasswordValidator(), validate, forgetPasswordHandler);
router.patch('/reset/:token', resetPasswordValidator(), validate, resetPasswordHandler);

module.exports = router;
