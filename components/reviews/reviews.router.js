const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const router = require('express').Router();
const ReviewsValidator = require('./reviews.validator');
const ReviewsController = require('./reviews.controller');

router.post(
   '/',
   isAuthenticated,
   ReviewsValidator.validateCreateReview(),
   ReviewsValidator.validate,
   ReviewsController.createReview,
);

router.delete(
   '/:reviewId',
   isAuthenticated,
   ReviewsValidator.validateDeleteReview(),
   ReviewsValidator.validate,
   ReviewsController.deleteReview,
);

module.exports = router;
