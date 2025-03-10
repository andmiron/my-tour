const crypto = require('node:crypto');
const { sendMail } = require('../../services/email');
const AppError = require('../../common/AppError');
const User = require('../users/users.model');
const config = require('../../config/config');

class AuthController {
   async signup(req, res) {
      const { email, password } = req.body;
      const user = await User.create({ email, password });
      res.status(201).send({
         status: 'Signed up',
         data: user.email,
      });
   }

   login(req, res) {
      res.status(200).send({
         status: 'Logged in',
         data: req.user,
      });
   }

   logout(req, res, next) {
      req.logout((err) => {
         if (err) return next(err);
         res.status(200).clearCookie(config.get('session.name')).send({
            status: 'Logged out',
            data: null,
         });
      });
   }

   async forgetPassword(req, res, next) {
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
   }

   async resetPassword(req, res) {
      const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
      const user = await User.findOne({ passwordResetToken: hashedToken }).select('+password').exec();
      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      res.status(200).send({
         status: 'Password reset',
         data: user.email,
      });
   }

   successfulGoogleLogin(req, res) {
      res.render('googleAuthSuccess');
   }

   failedGoogleLogin(req, res) {
      res.render('googleAuthFailure');
   }
}

module.exports = new AuthController();
