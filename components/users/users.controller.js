const sharp = require('sharp');
const User = require('./users.model');
const AppError = require('../../common/AppError');
const { uploadToS3, deleteFromS3 } = require('../../services/clientS3');
const uploadFile = require('../../services/multer');
const config = require('../../config/config');

class UsersController {
   async uploadUserPhoto(req, res) {
      const resizedPhotoBuffer = await sharp(req.file.buffer).resize(300, 300).jpeg().toBuffer();
      const uploadedFileURL = await uploadToS3(resizedPhotoBuffer, `user-${req.user.id}.jpeg`, 'image/jpeg');
      const updatedUser = await User.findByIdAndUpdate(req.user._id, { photo: uploadedFileURL }, { new: true }).exec();
      res.status(200).send({
         status: 'Photo uploaded',
         data: updatedUser.photo,
      });
   }

   async deletePhoto(req, res, next) {
      const user = await User.findById(req.user._id).exec();
      if (user.photo.includes('default_user')) return next(AppError.badRequest('You have no photo!'));
      const deleteResult = await deleteFromS3(`user-${req.user._id}.jpeg`);
      user.photo = new User().photo;
      await user.save();
      res.status(200).send({
         status: 'Photo deleted',
         data: deleteResult,
      });
   }

   async changeEmail(req, res) {
      const user = await User.findByIdAndUpdate(
         req.user._id,
         { email: req.body.email },
         { new: true, runValidators: true },
      ).exec();
      res.status(200).send({
         status: 'Email changed',
         data: user.email,
      });
   }

   async changePassword(req, res) {
      const user = await User.findById(req.user._id).select('+password').exec();
      user.password = req.body.newPassword;
      await user.save();
      res.status(200).send({
         status: 'Password changed',
         data: user,
      });
   }

   async deleteUser(req, res, next) {
      if (!req.user.photo.includes('default_user')) await deleteFromS3(`user-${req.user._id}.jpeg`);
      await User.deleteUser(req.user._id);
      req.logout((err) => {
         if (err) return next(err);
         req.session.destroy(() => {
            res.clearCookie(config.get('session.name')).status(200).send({
               status: 'User deleted',
               data: null,
            });
         });
      });
   }

   async getMe(req, res) {
      res.status(200).send({
         status: 'success',
         data: req.user,
      });
   }
}

module.exports = new UsersController();
