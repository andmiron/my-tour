const AppError = require('../utils/app.error');

function handleError(err, req, res, next) {
   req.log.error(err);
   const code = err.code || 500;
   if (err instanceof AppError) {
      return res.status(code).json({
         status: 'error',
         data: err.message,
      });
   }
   return res.status(500).json({
      status: 'error',
      data: 'something went wrong',
   });
}

module.exports = handleError;
