const router = require('express').Router();
const passport = require('passport');
const AuthController = require('./auth.controller');
const AuthValidator = require('../auth/auth.validator');
const { isAuthenticated } = require('../../middlewares/isAuthenticated');

router.post('/signup', AuthValidator.validateSignup(), AuthValidator.validate, AuthController.signup);
router.post(
   '/login',
   AuthValidator.validateLogin(),
   AuthValidator.validate,
   passport.authenticate('local'),
   AuthController.login,
);
router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get(
   '/google/callback',
   passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/',
   }),
);
router.get('/google/success', isAuthenticated, AuthController.successfulGoogleLogin);
router.get('/google/failure', AuthController.failedGoogleLogin);
router.post('/logout', isAuthenticated, AuthController.logout);
router.post('/forget', AuthValidator.validateForgetPassword(), AuthValidator.validate, AuthController.forgetPassword);
router.patch(
   '/reset/:token',
   AuthValidator.validateResetPassword,
   AuthValidator.validate,
   AuthController.resetPassword,
);

module.exports = router;
