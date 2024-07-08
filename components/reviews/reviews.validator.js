const { body, param } = require('express-validator');
const Tour = require('../tours/tours.model');
const Review = require('../reviews/reviews.model');
const BaseValidator = require('../../common/BaseValidator');

class ReviewsValidator extends BaseValidator {
   constructor() {
      super();
   }

   validateCreateReview() {
      return [
         body('text').isLength({ min: 10 }).withMessage('Review text must be at least 10 characters!'),
         body('rating').isIn([1, 2, 3, 4, 5]).withMessage('Rating must be between 1 and 5!'),
         body('tourId')
            .isMongoId()
            .custom(async (tourId, { req }) => {
               const tour = await Tour.findById(tourId).exec();
               if (!tour) return Promise.reject('Invalid tour!');
               if (tour.ownerId === req.user.id) return Promise.reject('You can not review your own tour!');
               req.body.tourId = tour.id;
            }),
      ];
   }

   validateGetReview() {
      return [
         param('id')
            .isMongoId()
            .withMessage('Invalid review id!')
            .custom(async (id) => {
               const review = await Review.findById(id).exec();
               if (!review) return Promise.reject('There is no such review!');
            }),
      ];
   }

   validateDeleteReview() {
      return [
         param('reviewId')
            .isMongoId()
            .custom(async (id, { req }) => {
               const review = await Review.findById(id).populate('ownerId', '_id').exec();
               if (!review) return Promise.reject('There is no such review!');
               if (review.ownerId.id !== req.user.id) return Promise.reject('You can only delete your own review!');
            }),
      ];
   }
}

module.exports = new ReviewsValidator();
