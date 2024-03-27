const catchAsync = require('../utils/catch.async');
const User = require('../models/user.model');
const crypto = require('crypto');

exports.signupHandler = catchAsync(async (req, res) => {
   const { email, password } = req.body;
   const user = await User.create({ email, password });
   res.status(201).send(user);
});

exports.loginHandler = (req, res) => {
   res.status(200).send(req.user);
};

exports.logoutHandler = catchAsync(async (req, res, next) => {
   req.logout((err) => {
      if (err) return next(err);
      res.status(200).clearCookie(process.env.SESSION_NAME).send();
   });
});

exports.forgetPasswordHandler = catchAsync(async (req, res) => {
   const user = await User.findOne({ email: req.body.email });
   const resetToken = user.createResetToken();
   await user.save({ validateBeforeSave: false });
   res.status(200).send(resetToken);
});

exports.resetPasswordHandler = catchAsync(async (req, res, next) => {
   const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
   const user = await User.findOne({ passwordResetToken: hashedToken }).select('+password');
   user.password = req.body.password;
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;
   await user.save();
   res.status(200).send(user);
});

exports.deleteUserHandler = catchAsync(async (req, res, next) => {
   await User.findByIdAndDelete(req.user.id);
   req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
         res.clearCookie(process.env.SESSION_NAME).status(204).send();
      });
   });
});
