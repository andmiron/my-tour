const crypto = require('crypto');
const catchAsync = require('../utils/catch.async');
const User = require('../models/user.model');
const { sendMail } = require('../controllers/email.controller');
const AppError = require('../utils/app.error');

exports.signupHandler = catchAsync(async (req, res) => {
   const { email, password } = req.body;
   const user = await User.create({ email, password });
   res.status(201).send({
      message: 'Signed up',
      user,
   });
});

exports.loginHandler = (req, res) => {
   res.status(200).send({
      message: 'Logged in',
      user: req.user,
   });
};

exports.logoutHandler = catchAsync(async (req, res, next) => {
   req.logout((err) => {
      if (err) return next(err);
      res.status(200).clearCookie(process.env.SESSION_NAME).send({
         message: 'Logged out',
         user: null,
      });
   });
});

exports.forgetPasswordHandler = catchAsync(async (req, res, next) => {
   const { email } = req.body;
   const user = await User.findOne({ email });
   const resetToken = user.createResetToken();
   await user.save({ validateBeforeSave: false });
   try {
      const resetLink = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
      await sendMail(email, 'Reset password link', resetLink);
      res.status(200).json({
         message: 'Token created and sent to email',
         resetToken,
      });
   } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(AppError.internal('Sending email error! Try again.'));
   }
});

exports.resetPasswordHandler = catchAsync(async (req, res, next) => {
   const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
   const user = await User.findOne({ passwordResetToken: hashedToken }).select('+password');
   user.password = req.body.password;
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;
   await user.save();
   res.status(200).send({
      message: 'Password reset',
      user: user,
   });
});

exports.deleteUserHandler = catchAsync(async (req, res, next) => {
   await User.findByIdAndDelete(req.user.id);
   req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
         res.clearCookie(process.env.SESSION_NAME).status(200).send({
            message: 'User deleted',
            user: null,
         });
      });
   });
});
