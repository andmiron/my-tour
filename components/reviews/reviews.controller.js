const catchAsync = require('../../utils/catch.async');
const Review = require('./reviews.model');

class ReviewsController {
   async submitReviewHandler(req, res) {
      const { tourId, rating, text } = req.body;
      const { _id: ownerId } = req.user;
      const newReview = await Review.create({ tourId, rating, text, ownerId });
      res.status(201).send({
         status: 'Review submitted',
         data: newReview,
      });
      //    TODO finish updating tours average ratings
   }
}

module.exports = new ReviewsController();
