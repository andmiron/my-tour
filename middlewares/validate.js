const { validationResult, body, param, check } = require('express-validator');
const AppError = require('../utils/app.error');
const User = require('../models/user.model');
const crypto = require('node:crypto');

exports.validate = (req, res, next) => {
   const validationErrors = validationResult(req);
   if (validationErrors.isEmpty()) return next();
   const errorMessage = validationErrors.formatWith((err) => err.msg).array({ onlyFirstError: true });
   return next(AppError.badRequest(errorMessage[0]));
};

exports.signupValidator = () => {
   return [
      body('email')
         .exists()
         .withMessage('Provide an email!')
         .isEmail()
         .withMessage('Email is not valid!')
         .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) return Promise.reject('User already exists!');
         }),
      body('password')
         .exists()
         .withMessage('Provide a password!')
         .isLength({ min: 4 })
         .withMessage('Password must be longer!'),
   ];
};

exports.loginValidator = () => {
   return [
      body('email').exists().withMessage('Provide an email!').isEmail().withMessage('Email is not valid!'),
      body('password').exists().withMessage('Provide a password!'),
   ];
};

exports.forgetPasswordValidator = () => {
   return [
      body('email')
         .exists()
         .withMessage('Provide an email!')
         .isEmail()
         .withMessage('Email is not valid!')
         .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user.provider === 'google') return Promise.reject('Try login with google!');
            if (!user) return Promise.reject('No user with this email!');
         }),
   ];
};

exports.resetPasswordValidator = () => {
   return [
      param('token')
         .exists()
         .isString()
         .isLength({ min: 64, max: 64 })
         .withMessage('Provide a valid token!')
         .custom(async (token) => {
            const user = await User.findOne({
               passwordResetToken: crypto.createHash('sha256').update(token).digest('hex'),
               passwordResetExpires: {
                  $gt: Date.now(),
               },
            });
            if (!user) return Promise.reject('Token is invalid or expired!');
         }),
      body('password').exists().notEmpty().isLength({ min: 4 }).withMessage('Password must be longer!'),
   ];
};

exports.updatePasswordValidator = () => {
   return [
      body('oldPassword')
         .exists()
         .notEmpty()
         .custom(async (oldPassword, { req }) => {
            const user = await User.findById(req.user._id).select('+password');
            if (!user.isValidPassword(user.password, oldPassword)) return Promise.reject('Password is incorrect!');
         }),
      body('newPassword').exists().notEmpty().isLength({ min: 4 }).withMessage('Password must be longer!'),
      body('newPasswordConfirm')
         .custom((newPasswordConfirm, { req }) => newPasswordConfirm === req.body.newPassword)
         .withMessage('New passwords do not match!'),
   ];
};
