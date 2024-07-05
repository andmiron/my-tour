const Review = require('./reviews.model');

class ReviewsController {
   async createReview(req, res) {
      const { text, rating, tourId } = req.body;
      const ownerId = req.user.id;
      const newReview = await Review.create({ text, rating, tourId, ownerId });
      res.status(201).send({
         status: 'Review created',
         data: newReview,
      });
   }

   async getAllReviews(req, res) {
      const reviews = await Review.find().exec();
      res.status(200).send({
         status: 'Success',
         data: reviews,
      });
   }

   async getReview(req, res) {}
}

module.exports = new ReviewsController();
