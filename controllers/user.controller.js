const sharp = require('sharp');
const User = require('../models/user.model');
const catchAsync = require('../utils/catch.async');
const { multerUpload } = require('../utils/multer');
const AppError = require('../utils/app.error');
const { faker } = require('@faker-js/faker');
const fetch = require('node-fetch');
const fs = require('node:fs/promises');

const resizeUserPhoto = catchAsync(async (req, res, next) => {
   req.file.filename = `user-${req.user._id}.jpeg`;
   await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/${req.file.filename}`);
   next();
});

const saveUserPhoto = catchAsync(async (req, res) => {
   const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { photo: `/img/${req.file.filename}` },
      { new: true },
   );
   res.status(200).send({
      status: 'Photo updated',
      data: user.photo,
   });
});

exports.uploadUserPhotoHandler = [multerUpload.single('inputPhoto'), resizeUserPhoto, saveUserPhoto];

exports.generatePhotoHandler = catchAsync(async (req, res) => {
   const photoUrl = faker.image.avatarLegacy();
   const photo = await fetch(photoUrl);
   const photoPath = `user-${req.user._id}.jpeg`;
   await sharp(await photo.buffer())
      .resize(300, 300)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/${photoPath}`);
   const user = await User.findByIdAndUpdate({ _id: req.user._id }, { photo: `/img/${photoPath}` }, { new: true });
   res.status(200).send({
      status: 'Photo generated',
      data: user.photo,
   });
});

exports.deletePhotoHandler = catchAsync(async (req, res, next) => {
   const user = await User.findById(req.user._id);
   if (!user.photo) return next(AppError.badRequest('You have no photo!'));
   await fs.unlink(`public/img/user-${req.user._id}.jpeg`);
   user.photo = `/img/default_user.jpg`;
   await user.save();
   res.status(200).send({
      status: 'Photo deleted',
      data: user.photo,
   });
});

exports.changeEmailHandler = catchAsync(async (req, res, next) => {
   const { email } = req.body;
   const user = await User.findByIdAndUpdate(req.user._id, { email }, { new: true, runValidators: true });
   res.status(200).send({
      status: 'Email changed',
      data: user.email,
   });
});

exports.changePasswordHandler = catchAsync(async (req, res, next) => {
   const user = await User.findById(req.user._id).select('+password');
   user.password = req.body.newPassword;
   await user.save();
   res.status(200).send({
      status: 'Password changed',
      data: user,
   });
});

exports.deleteUserHandler = catchAsync(async (req, res, next) => {
   const user = await User.findById(req.user._id);
   if (user.photo) await fs.unlink(`public/img/user-${req.user._id}.jpeg`);
   await user.deleteOne();
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
