const multer = require('multer');
const AppError = require('../utils/app.error');

const uploadFile = multer({
   storage: multer.memoryStorage(),
   fileFilter: (req, file, done) => {
      if (!file.mimetype.startsWith('image')) return done(AppError.badRequest('Upload an image!'), false);
      if (file) return done(null, true);
   },
});

module.exports = uploadFile;
