const AppError = require('../common/AppError');

exports.isAuthenticated = (req, res, next) => {
   if (!req.isAuthenticated()) return next(AppError.unauthorized('Please log in!'));
   res.locals.user = req.user;
   next();
};

exports.isAdmin = (req, res, next) => {
   return req.isAuthenticated() && req.user.role === 'admin' ? next() : next(AppError.forbidden('Unauthorized!'));
};
