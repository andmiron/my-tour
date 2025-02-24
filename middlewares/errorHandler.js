const AppError = require('../common/AppError');

function handleError(err, req, res, next) {
   if (req.originalUrl.startsWith('/api')) {
      const code = err.code || 500;
      if (err instanceof AppError) {
         return res.status(code).json({
            originalUrl: req.originalUrl,
            status: 'error',
            data: err.message,
         });
      }
      console.log(err);
      return res.status(500).json({
         status: 'error',
         data: 'Something went wrong!',
      });
   }
   console.log(err);
   res.render('error', { title: 'Error', code: err.code, message: err.message });
}

module.exports = handleError;
