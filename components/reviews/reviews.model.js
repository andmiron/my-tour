const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
   {
      text: {
         type: String,
         required: [true, 'Review cannot be empty!'],
      },
      rating: {
         type: Number,
         min: 1,
         max: 5,
         required: [true, 'Leave a review 1 to 5!'],
      },
      tourId: {
         type: mongoose.Schema.ObjectId,
         ref: 'Tour',
         required: [true, 'A review must belong to a tour!'],
      },
      ownerId: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'A review must belong to a user!'],
      },
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      timestamps: true,
   },
);

reviewSchema.post('save', async function (doc) {
   await mongoose.model('User').findByIdAndUpdate(doc.ownerId, { $push: { reviews: doc._id } });
   await mongoose.model('Tour').findByIdAndUpdate(doc.tourId, { $push: { reviews: doc._id } });
});

reviewSchema.statics.deleteReview = async function (reviewId) {
   const session = await mongoose.startSession();
   await session.startTransaction();
   try {
      await mongoose.model('User').updateMany({ reviews: reviewId }, { $pull: { reviews: reviewId } }, { session });
      await mongoose.model('Tour').updateMany({ reviews: reviewId }, { $pull: { reviews: reviewId } }, { session });
      await this.findByIdAndDelete(reviewId);
      await session.commitTransaction();
   } catch (err) {
      await session.abortTransaction();
   } finally {
      await session.endSession();
   }
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
