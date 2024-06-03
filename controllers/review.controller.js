const catchAsync = require('../utils/catch.async');
const Review = require('../models/review.model');

exports.submitReviewHandler = catchAsync(async (req, res) => {
   const { tourId: tour, rating, text } = req.body;
   const { _id: user } = req.user;
   const newReview = await Review.create({ tour, rating, text, user });
   res.status(201).send({
      status: 'Review submitted',
      data: newReview,
   });
});
