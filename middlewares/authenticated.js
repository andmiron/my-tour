const AppError = require('../utils/app.error');

module.exports = (req, res, next) => {
   return req.isAuthenticated() ? next() : next(AppError.unauthorized('Please log in!'));
};
