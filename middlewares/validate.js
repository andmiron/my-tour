const { validationResult, body, param } = require('express-validator');
const AppError = require('../utils/app.error');
const User = require('../models/user.model');
const crypto = require('node:crypto');

exports.validate = (req, res, next) => {
   const validationErrors = validationResult(req);
   if (validationErrors.isEmpty()) return next();
   const errorMessage = validationErrors.formatWith((err) => err.msg).array();
   return next(AppError.badRequest(errorMessage.join(', ')));
};

exports.signupValidator = () => {
   return [
      body('email')
         .exists()
         .isEmail()
         .withMessage('Email is not valid!')
         .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) return Promise.reject('User already exists!');
         }),
      body('password').exists().notEmpty().isLength({ min: 4 }).withMessage('Password must be longer!'),
   ];
};

exports.loginValidator = () => {
   return [
      body('email').exists().isEmail().withMessage('Email is not valid!'),
      body('password').exists().notEmpty().withMessage('Password must not be empty!'),
   ];
};

exports.forgetPasswordValidator = () => {
   return [
      body('email')
         .exists()
         .isEmail()
         .withMessage('Email is not valid!')
         .custom(async (email) => {
            const user = await User.findOne({ email });
            if (!user) return Promise.reject('No user with this email!');
         }),
   ];
};

exports.resetPasswordValidator = () => {
   return [
      param('token')
         .exists()
         .isString()
         .notEmpty()
         .isLength({ min: 64, max: 64 })
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
            const user = await User.findById(req.user.id).select('+password');
            if (!user.isValidPassword(user.password, oldPassword)) return Promise.reject('Password is incorrect!');
         }),
      body('newPassword').exists().notEmpty().isLength({ min: 4 }).withMessage('Password must be longer!'),
      body('newPasswordConfirm')
         .custom((newPasswordConfirm, { req }) => newPasswordConfirm === req.body.newPassword)
         .withMessage('New passwords do not match!'),
   ];
};
