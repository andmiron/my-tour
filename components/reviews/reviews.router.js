const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const router = require('express').Router();
const ReviewsValidator = require('./reviews.validator');
const ReviewsController = require('./reviews.controller');
const catchAsync = require('../../utils/catch.async');

router.post(
   '/',
   isAuthenticated,
   ReviewsValidator.validateCreateReview(),
   ReviewsValidator.validate,
   catchAsync(ReviewsController.createReview),
);

module.exports = router;
