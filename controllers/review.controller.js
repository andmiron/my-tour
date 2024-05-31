const catchAsync = require('../utils/catch.async');
const Review = require('../models/review.model');

exports.submitReviewHandler = catchAsync(async (req, res) => {
   const newReview = await Review.create({ ...req.body, user: req.user.id });
   res.status(201).send({
      status: 'Review submitted',
      data: newReview,
   });
});
