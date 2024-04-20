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
      { photo: `img/${req.file.filename}` },
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
   const user = await User.findByIdAndUpdate({ _id: req.user._id }, { photo: `img/${photoPath}` }, { new: true });
   res.status(200).send({
      status: 'Photo generated',
      data: user.photo,
   });
});

// TODO check if photo is default or assigned and then delete
exports.deletePhotoHandler = catchAsync(async (req, res) => {
   await fs.unlink(`public/img/user-${req.user._id}.jpeg`);
   const user = await User.findByIdAndUpdate({ _id: req.user._id }, { photo: `img/default_user.jpg` }, { new: true });
   res.status(200).send({
      status: 'Photo deleted',
      data: user.photo,
   });
});

exports.deleteUserHandler = catchAsync(async (req, res, next) => {
   await fs.unlink(`public/img/user-${req.user._id}.jpeg`);
   await User.findByIdAndDelete(req.user._id);
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
