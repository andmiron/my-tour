const { body, param } = require('express-validator');
const User = require('../users/users.model');
const crypto = require('node:crypto');
const BaseValidator = require('../../common/BaseValidator');

class AuthValidator extends BaseValidator {
   constructor() {
      super();
   }

   validateSignup() {
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
   }

   validateLogin() {
      return [
         body('email').isEmail().withMessage('Email is not valid!'),
         body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long!'),
      ];
   }

   validateForgetPassword() {
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
   }

   validateResetPassword() {
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
   }
}

module.exports = new AuthValidator();
