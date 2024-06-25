const router = require('express').Router();
const passport = require('passport');
const AuthController = require('./auth.controller');
const AuthValidator = require('../auth/auth.validator');
const catchAsync = require('../../utils/catch.async');
const { isAuthenticated } = require('../../middlewares/isAuthenticated');

router.post('/signup', AuthValidator.validateSignup(), AuthValidator.validate, catchAsync(AuthController.signup));
router.post(
   '/login',
   AuthValidator.validateLogin(),
   AuthValidator.validate,
   passport.authenticate('local'),
   catchAsync(AuthController.login),
);
router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get(
   '/google/callback',
   passport.authenticate('google', {
      successRedirect: '/api/v1/auth/google/success',
      failureRedirect: '/api/v1/auth/google/failure',
   }),
);
router.get('/google/success', isAuthenticated, AuthController.successfulGoogleLogin);
router.get('/google/failure', AuthController.failedGoogleLogin);
router.post('/logout', isAuthenticated, AuthController.logout);
router.post(
   '/forget',
   AuthValidator.validateForgetPassword(),
   AuthValidator.validate,
   catchAsync(AuthController.forgetPassword),
);
router.patch(
   '/reset/:token',
   AuthValidator.validateResetPassword,
   AuthValidator.validate,
   catchAsync(AuthController.resetPassword),
);

module.exports = router;
