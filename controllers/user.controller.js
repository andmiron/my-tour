const fs = require('node:fs/promises');
const sharp = require('sharp');
const User = require('../models/user.model');
const catchAsync = require('../utils/catch.async');
const AppError = require('../utils/app.error');
const { uploadToS3, deleteFromS3 } = require('../services/clientS3');
const uploadFile = require('../services/multer');
const getRandomPhotoBuffer = require('../utils/randomPhoto');

exports.uploadUserPhotoHandler = [
   uploadFile.single('inputPhoto'),
   catchAsync(async (req, res, next) => {
      const resizedPhotoBuffer = await sharp(req.file.buffer).resize(300, 300).jpeg().toBuffer();
      const uploadedFileURL = await uploadToS3(resizedPhotoBuffer, `user-${req.user.id}.jpeg`, 'image/jpeg');
      const updatedUser = await User.findByIdAndUpdate(req.user._id, { photo: uploadedFileURL }, { new: true }).exec();
      res.status(200).send({
         status: 'Photo uploaded',
         data: updatedUser.photo,
      });
   }),
];

exports.generatePhotoHandler = catchAsync(async (req, res) => {
   const randomPhotoBuffer = await getRandomPhotoBuffer();
   const resizedPhotoBuffer = await sharp(randomPhotoBuffer).resize(300, 300).jpeg().toBuffer();
   const uploadedFileURL = await uploadToS3(resizedPhotoBuffer, `user-${req.user.id}.jpeg`, 'image/jpeg');
   const updatedUser = await User.findByIdAndUpdate(req.user._id, { photo: uploadedFileURL }, { new: true }).exec();
   res.status(200).send({
      status: 'Photo generated',
      data: updatedUser.photo,
   });
});

exports.deletePhotoHandler = catchAsync(async (req, res, next) => {
   const user = await User.findById(req.user._id).exec();
   if (user.photo.includes('default_user')) return next(AppError.badRequest('You have no photo!'));
   const deleteResult = await deleteFromS3(`user-${req.user._id}.jpeg`);
   user.photo = new User().photo;
   await user.save();
   res.status(200).send({
      status: 'Photo deleted',
      data: deleteResult,
   });
});

exports.changeEmailHandler = catchAsync(async (req, res, next) => {
   const user = await User.findByIdAndUpdate(
      req.user._id,
      { email: req.body.email },
      { new: true, runValidators: true },
   ).exec();
   res.status(200).send({
      status: 'Email changed',
      data: user.email,
   });
});

exports.changePasswordHandler = catchAsync(async (req, res, next) => {
   const user = await User.findById(req.user._id).select('+password').exec();
   user.password = req.body.newPassword;
   await user.save();
   res.status(200).send({
      status: 'Password changed',
      data: user,
   });
});

exports.deleteUserHandler = catchAsync(async (req, res, next) => {
   await User.deleteUser(req.user._id);
   req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
         res.clearCookie(process.env.SESSION_NAME).status(200).send({
            status: 'User deleted',
            data: null,
         });
      });
   });
});

exports.getMeHandler = catchAsync(async (req, res) => {
   res.status(200).send({
      status: 'success',
      data: req.user,
   });
});
