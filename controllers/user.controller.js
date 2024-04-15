const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user.model');
const catchAsync = require('../utils/catch.async');
const AppError = require('../utils/app.error');

const upload = multer({
   dest: multer.memoryStorage(),
   fileFilter: (req, file, done) => {
      if (!file.mimetype.startWith('image')) return done(AppError.badRequest('Upload an image!'), false);
      return done(null, true);
   },
});

exports.uploadUserPhotoHandler = catchAsync(async (req, res, next) => {
   upload.single('inputPhoto');
   res.status(200).send(req.file.filename);
});

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
   if (!req.file) return next();

   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

   await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

   next();
});
