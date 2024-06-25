const { body, query } = require('express-validator');
const Tour = require('../tours/tours.model');
const AppError = require('../../utils/app.error');
const BaseValidator = require('../../common/BaseValidator');

class BookingsValidator extends BaseValidator {
   constructor() {
      super();
   }

   validateCreateCheckoutSession() {
      return [
         body('tourSlug').custom(async (tourSlug, { req }) => {
            const tour = await Tour.findOne({ slug: tourSlug }).exec();
            if (!tour) return Promise.reject(AppError.badRequest('Invalid tour id!'));
            req.body.tour = tour;
         }),
      ];
   }
}

module.exports = new BookingsValidator();
