const { body } = require('express-validator');
const Tour = require('../tours/tours.model');
const BaseValidator = require('../../common/BaseValidator');

class ReviewsValidator extends BaseValidator {
   constructor() {
      super();
   }

   validateSubmitReview() {
      return [
         body('text').isLength({ min: 10 }).withMessage('Review text must be at least 10 characters!'),
         body('rating').isIn([1, 2, 3, 4, 5]).withMessage('Rating must be between 1 and 5!'),
         body('tour')
            .isMongoId()
            .custom(async (tourId, { req }) => {
               const tour = await Tour.findById(tourId).exec();
               if (!tour) return Promise.reject('Invalid tour!');
               if (tour.ownerId === req.user.id) return Promise.reject('You can not review your own tour!');
               req.body.tourId = tour.id;
            }),
      ];
   }
}

module.exports = new ReviewsValidator();
