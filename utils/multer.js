const multer = require('multer');
const AppError = require('./app.error');

exports.upload = multer({
   storage: multer.memoryStorage(),
   fileFilter: (req, file, done) => {
      if (!file.mimetype.startsWith('image')) return done(AppError.badRequest('Upload an image!'), false);
      return done(null, true);
   },
});
