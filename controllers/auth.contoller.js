const crypto = require('crypto');
const catchAsync = require('../utils/catch.async');
const User = require('../models/user.model');
const { sendMail } = require('../controllers/email.controller');
const AppError = require('../utils/app.error');

exports.signupHandler = catchAsync(async (req, res) => {
   const { email, password } = req.body;
   const user = await User.create({ email, password });
   res.status(201).send({
      status: 'Signed up',
      data: user,
   });
});

exports.loginHandler = (req, res) => {
   res.status(200).send({
      status: 'Logged in',
      data: req.user,
   });
};

exports.logoutHandler = catchAsync(async (req, res, next) => {
   req.logout((err) => {
      if (err) return next(err);
      res.status(200).clearCookie(process.env.SESSION_NAME).send({
         status: 'Logged out',
         data: null,
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
         status: 'Token created and sent to email',
         data: resetToken,
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
      status: 'Password reset',
      data: user,
   });
});
