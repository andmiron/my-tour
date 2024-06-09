const AppError = require('../utils/app.error');

function handleError(err, req, res, next) {
   console.error(err);
   if (req.originalUrl.startsWith('/api')) {
      const code = err.code || 500;
      if (err instanceof AppError) {
         return res.status(code).json({
            status: 'error',
            data: err.message,
         });
      }
      return res.status(500).json({
         status: 'error',
         data: 'Something went wrong!',
      });
   }
   res.render('error', { title: 'Error', code: err.code, message: err.message });
}

module.exports = handleError;
