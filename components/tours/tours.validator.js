const { param, body } = require('express-validator');
const Tour = require('./tours.model');
const BaseValidator = require('../../common/BaseValidator');
const AppError = require('../../common/AppError');

class ToursValidator extends BaseValidator {
   constructor() {
      super();
   }

   validateGetTour() {
      return [
         param('slug')
            .isSlug()
            .withMessage('Tour name is incorrect!')
            .custom(async (slug) => {
               const tour = await Tour.findOne({ slug }).exec();
               if (!tour) return Promise.reject('There is no such tour!');
            }),
      ];
   }

   validateCreateTour() {
      return [
         body('name')
            .trim()
            .isLength({ min: 10, max: 40 })
            .withMessage('Tour name must be minimum 10 and maximum 40 characters!')
            .custom(async (name) => {
               const tour = await Tour.findOne({ name }).exec();
               if (tour) return Promise.reject('Tour with this name already exists!');
            }),
         body('summary').isString().withMessage('Tour must have a summary!'),
         body('description').isString().withMessage('Tour must have a description!'),
         body('price').isInt({ min: 1 }).withMessage('Invalid price!'),
         body('priceDiscount')
            .optional()
            .custom((value, { req }) => {
               return value < req.body.price;
            })
            .withMessage('Discount must be lower than the price!'),
         body('duration').isInt().withMessage('Invalid tour duration!'),
         body('maxGroupSize').isInt().withMessage('Invalid tour group size!'),
         body('difficulty')
            .isIn(['easy', 'medium', 'difficult'])
            .withMessage('Difficulty is [easy, medium or difficult]'),
         body('locDesc').isString().withMessage('Provide start location description!'),
         body('locCoords').isLatLong().withMessage('Invalid location coordinates!'),
      ];
   }

   validateEditTour() {
      return [
         body('name')
            .optional()
            .isLength({ min: 10, max: 40 })
            .withMessage('Tour name must be minimum 10 and maximum 40 characters!')
            .custom(async (name) => {
               const tour = await Tour.findOne({ name }).exec();
               if (tour) return Promise.reject('Name is already occupied!');
            }),
         body('summary').optional().isString().withMessage('Tour must have a summary!'),
         body('description').optional().isString().withMessage('Tour must have a description!'),
         body('price').optional().isInt({ min: 1 }).withMessage('Invalid price!'),
         body('priceDiscount')
            .optional()
            .custom((value, { req }) => {
               return value < req.body.price;
            })
            .withMessage('Discount must be lower than the price!'),
         body('duration').optional().isInt().withMessage('Invalid tour duration!'),
         body('maxGroupSize').optional().isInt().withMessage('Invalid tour group size!'),
         body('difficulty')
            .optional()
            .isIn(['easy', 'medium', 'difficult'])
            .withMessage('Difficulty is [easy, medium or difficult]'),
         body('locDesc').optional().isString().withMessage('Provide start location description!'),
         body('locCoords').optional().isLatLong().withMessage('Invalid location coordinates!'),
      ];
   }

   validateDeleteTour() {
      return [
         param('slug').custom(async (slug, { req }) => {
            const tour = await Tour.findOne({ slug }).exec();
            if (!tour) return Promise.reject('There is no such tour!');
            req.body.deleteId = tour.id;
         }),
      ];
   }

   validateRenderEditTour() {
      return [
         param('tourSlug').custom(async (tourSlug, { req }) => {
            const tour = await Tour.findOne({ slug: tourSlug, ownerId: req.user.id }).exec();
            if (!tour) return Promise.reject(AppError.forbidden('You can only edit your own tours!'));
            req.body.tourToEdit = tour;
         }),
      ];
   }
}

module.exports = new ToursValidator();
