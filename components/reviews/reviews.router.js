const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const router = require('express').Router();
const ReviewsValidator = require('./reviews.validator');
const ReviewsController = require('./reviews.controller');
const catchAsync = require('../../utils/catch.async');

router.post(
   '/',
   isAuthenticated,
   ReviewsValidator.validateSubmitReview(),
   ReviewsValidator.validate,
   catchAsync(ReviewsController.submitReviewHandler),
);

module.exports = router;
