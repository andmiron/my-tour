const { validationResult, body, param } = require('express-validator');
const AppError = require('../utils/app.error');
const User = require('../models/user.model');
const Tour = require('../models/tour.model');
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

exports.changeEmailValidator = () => {
   return [
      body('email')
         .exists()
         .withMessage('Provide an email!')
         .isEmail()
         .withMessage('Email is not valid!')
         .custom(async (newEmail, { req }) => {
            const user = await User.findById(req.user._id);
            if (user.email === newEmail) return Promise.reject('Email must be different from the current one!');
         }),
   ];
};

exports.changePasswordValidator = () => {
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

exports.getTourValidator = () => {
   return [
      param('slug')
         .exists()
         .isSlug()
         .withMessage('Tour name is incorrect!')
         .custom(async (slug) => {
            const tour = await Tour.findOne({ slug });
            if (!tour) return Promise.reject('There is no such tour!');
         }),
   ];
};

exports.createTourValidator = () => {
   return [
      body('name')
         .exists()
         .withMessage('Tour must have a name!')
         .trim()
         .isLength({ min: 10, max: 40 })
         .withMessage('Tour name is minimum 10 and maximum 40 characters!')
         .custom(async (name, { req }) => {
            const tour = await Tour.findOne({ name });
            if (tour) return Promise.reject('Tour with this name already exists!');
         }),
      body('summary').exists().withMessage('Tour must have a summary!'),
      body('description').exists().withMessage('Tour must have a description!'),
      body('price').exists().toInt().withMessage('Tour must have a price!'),
      body('priceDiscount')
         .optional()
         .custom((value, { req }) => {
            return value < req.body.price;
         })
         .withMessage('Discount must be lower than the price!'),
      body('duration').exists().withMessage('Tour must have a duration!'),
      body('maxGroupSize').exists().toInt().withMessage('Tour must have a group size'),
      body('difficulty').isIn(['easy', 'medium', 'difficult']).withMessage('Difficulty is [easy, medium or difficult]'),
      body('startLocDesc').exists().withMessage('Provide start location description!'),
      body('startLocCoords').isLatLong().withMessage('Provide valid coordinates!'),
   ];
};

exports.submitReviewValidator = () => {
   return [
      body('text').isLength({ min: 10 }).withMessage('Review text must be at least 10 characters!'),
      body('rating').isIn([1, 2, 3, 4, 5]).withMessage('Rating must be between 1 and 5!'),
      body('tour').custom(async (slug, { req }) => {
         const tour = await Tour.findOne({ slug });
         if (!tour) return Promise.reject('Incorrect tour name!');
         if (tour.guide === req.user.id) return Promise.reject('You can not review your own tour!');
         req.body.tourId = tour.id;
      }),
   ];
};
