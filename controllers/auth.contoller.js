const catchAsync = require('../utils/catch.async');
const User = require('../models/user.model');

exports.signupHandler = catchAsync(async (req, res) => {
   const { email, password } = req.body;
   const user = await User.create({ email, password });
   res.status(201).send({
      status: 'signed up',
      email: user.email,
   });
});

exports.loginHandler = catchAsync(async (req, res) => {
   res.status(200).send({
      status: 'logged in',
      user: req.user,
   });
});

exports.logoutHandler = catchAsync(async (req, res, next) => {
   req.logout((err) => {
      if (err) return next(err);
   });
   res.status(200).send({
      status: 'logged out',
   });
});

exports.forgetPasswordHandler = catchAsync(async (req, res) => {
   const user = await User.findOne({ email: req.body.email });
   const resetToken = user.createResetToken();
   await user.save({ validateBeforeSave: false });
   res.status(200).json({
      status: 'success',
      resetToken: resetToken,
   });
});

exports.resetPasswordHandler = catchAsync(async (req, res) => {
   const user = await User.findOne({ passwordResetToken: req.params.token });
   user.password = req.body.password;
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;
   await user.save();
   req.login();
   res.status(200).json({
      status: 'success',
      user: req.user,
   });
});

// exports.updatePasswordHandler = catchAsync(async (req, res, next) => {});
