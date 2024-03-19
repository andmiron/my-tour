const AppError = require('../utils/app.error');

exports.isAuthenticated = (req, res, next) => {
   return req.isAuthenticated() ? next() : next(new AppError('Please log in!', 401));
};
