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
         .isEmail()
         .withMessage('Email is not valid!')
         .custom(async (email) => {
            const user = await User.findOne({ email }).exec();
            if (user) return Promise.reject('User already exists!');
         }),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long!'),
   ];
};

exports.loginValidator = () => {
   return [
      body('email').isEmail().withMessage('Email is not valid!'),
      body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long!'),
   ];
};

exports.forgetPasswordValidator = () => {
   return [
      body('email')
         .isEmail()
         .withMessage('Email is not valid!')
         .custom(async (email) => {
            const user = await User.findOne({ email }).exec();
            if (!user) return Promise.reject('No user with this email!');
            if (user.provider === 'google') return Promise.reject('Try login with google!');
         }),
   ];
};

exports.resetPasswordValidator = () => {
   return [
      param('token')
         .isString()
         .isLength({ min: 64, max: 64 })
         .withMessage('Provide a valid token!')
         .custom(async (token) => {
            const user = await User.findOne({
               passwordResetToken: crypto.createHash('sha256').update(token).digest('hex'),
               passwordResetExpires: {
                  $gt: Date.now(),
               },
            }).exec();
            if (!user) return Promise.reject('Token is invalid or expired!');
         }),
      body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long!'),
   ];
};

exports.changeEmailValidator = () => {
   return [
      body('email')
         .isEmail()
         .withMessage('Email is not valid!')
         .custom(async (newEmail, { req }) => {
            const user = await User.findOne({ email: req.user.email }).exec();
            const newEmailUser = await User.findOne({ email: newEmail }).exec();
            if (newEmailUser) return Promise.reject('New email is already occupied!');
            if (user.provider === 'google') return Promise.reject('You can not change google email!');
            if (user.email === newEmail) return Promise.reject('Email must be different from the current one!');
         }),
   ];
};

exports.changePasswordValidator = () => {
   return [
      body('oldPassword').custom(async (oldPassword, { req }) => {
         const user = await User.findById(req.user._id).select('+password').exec();
         if (!user.isPasswordValid(oldPassword)) return Promise.reject('Password is incorrect!');
      }),
      body('newPassword').exists().notEmpty().isLength({ min: 6 }).withMessage('Password must be longer!'),
      body('newPasswordConfirm')
         .custom((newPasswordConfirm, { req }) => newPasswordConfirm === req.body.newPassword)
         .withMessage('New passwords do not match!'),
   ];
};

exports.getTourValidator = () => {
   return [
      param('slug')
         .isSlug()
         .withMessage('Tour name is incorrect!')
         .custom(async (slug) => {
            const tour = await Tour.findOne({ slug }).exec();
            if (!tour) return Promise.reject('There is no such tour!');
         }),
   ];
};

exports.createTourValidator = () => {
   return [
      body('name')
         .trim()
         .isLength({ min: 10, max: 40 })
         .withMessage('Tour name must be minimum 10 and maximum 40 characters!')
         .custom(async (name) => {
            const tour = await Tour.findOne({ name }).exec();
            if (tour) return Promise.reject('Tour with this name already exists!');
         }),
      body('summary').isString().withMessage('Tour must have a summary!'),
      body('description').isString().withMessage('Tour must have a description!'),
      body('price').isInt({ min: 1 }).withMessage('Invalid price!'),
      body('priceDiscount')
         .optional()
         .custom((value, { req }) => {
            return value < req.body.price;
         })
         .withMessage('Discount must be lower than the price!'),
      body('duration').isInt().withMessage('Invalid tour duration!'),
      body('maxGroupSize').isInt().withMessage('Invalid tour group size!'),
      body('difficulty').isIn(['easy', 'medium', 'difficult']).withMessage('Difficulty is [easy, medium or difficult]'),
      body('locDesc').isString().withMessage('Provide start location description!'),
      body('locCoords').isLatLong().withMessage('Invalid location coordinates!'),
   ];
};

exports.createCheckoutSessionValidator = () => {
   return [
      body('tourSlug').custom(async (tourSlug, { req }) => {
         const tour = await Tour.findOne({ slug: tourSlug }).exec();
         if (!tour) return Promise.reject(AppError.badRequest('Invalid tour id!'));
         req.body.tour = tour;
      }),
   ];
};

exports.submitReviewValidator = () => {
   return [
      body('text').isLength({ min: 10 }).withMessage('Review text must be at least 10 characters!'),
      body('rating').isIn([1, 2, 3, 4, 5]).withMessage('Rating must be between 1 and 5!'),
      body('tour')
         .isMongoId()
         .custom(async (tourId, { req }) => {
            const tour = await Tour.findById({ tourId }).exec();
            if (!tour) return Promise.reject('Invalid tour!');
            if (tour.ownerId === req.user.id) return Promise.reject('You can not review your own tour!');
            req.body.tourId = tour.id;
         }),
   ];
};
