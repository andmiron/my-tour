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
const { isAuthenticated } = require('../middlewares/authenticated');
const router = require('express').Router();

router.post('/signup', signupValidator(), validate, signupHandler);
router.post('/login', loginValidator(), validate, passport.authenticate('local'), loginHandler);
router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get(
   '/auth/google/callback',
   passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }),
);
router.post('/logout', isAuthenticated, logoutHandler);
router.post('/forget', forgetPasswordValidator(), validate, forgetPasswordHandler);
router.post('/reset/:token', resetPasswordValidator(), validate, resetPasswordHandler);

module.exports = router;
