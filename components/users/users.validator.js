const { body } = require('express-validator');
const User = require('./users.model');
const BaseValidator = require('../../common/BaseValidator');

class UsersValidator extends BaseValidator {
   constructor() {
      super();
   }

   validateChangeEmail() {
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
   }

   validateChangePassword() {
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
   }
}

module.exports = new UsersValidator();
