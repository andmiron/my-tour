const AppError = require('../utils/app.error');

exports.isAuthenticated = (req, res, next) => {
   return req.isAuthenticated() ? next() : next(AppError.unauthorized('Please log in!'));
};

exports.isAdmin = (req, res, next) => {
   return req.isAuthenticated() && req.user.role === 'admin' ? next() : next(AppError.forbidden('Unauthorized!'));
};
