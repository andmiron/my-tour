const { validationResult } = require('express-validator');
const AppError = require('./AppError');

class BaseValidator {
   validate(req, res, next) {
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) return next();
      const errorMessage = validationErrors.formatWith((err) => err.msg).array({ onlyFirstError: true });
      return next(AppError.badRequest(errorMessage[0]));
   }
}

module.exports = BaseValidator;
