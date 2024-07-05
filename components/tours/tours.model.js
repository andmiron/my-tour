const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
   {
      slug: String,
      name: {
         type: String,
         required: [true, 'tour must have a name'],
         unique: true,
         trim: true,
         maxlength: [40, 'A tour name must have less or equal than 40 characters!'],
         minlength: [5, 'A tour name must have more or equal than 5 characters!'],
      },
      summary: {
         type: String,
         trim: true,
         required: [true, 'A tour must have a summary!'],
      },
      description: {
         type: String,
         trim: true,
         required: [true, 'A tour must have a description!'],
      },
      price: {
         type: Number,
         min: 1,
         required: [true, 'tour must have a price'],
      },
      priceDiscount: {
         type: Number,
         min: 1,
         validate: function (val) {
            return val < this.price;
         },
         message: 'A discount price ({VALUE}) must be lower than the regular price!',
      },
      duration: {
         type: Number,
         min: 1,
         max: 5,
         required: [true, 'A tour must have a duration!'],
      },
      maxGroupSize: {
         type: Number,
         min: 1,
         required: [true, 'A tour must have a group size!'],
      },
      difficulty: {
         type: String,
         required: [true, 'A tour must have a difficulty!'],
         enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is [easy, medium or difficult]!',
         },
      },
      location: {
         type: {
            type: String,
            default: 'Point',
         },
         description: String,
         coordinates: [Number],
      },
      imageCover: {
         type: String,
      },
      ownerId: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'A tour must have a guide!'],
      },
      reviews: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'Review',
         },
      ],
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      timestamps: true,
   },
);

tourSchema.virtual('averageRating').get(function () {
   if (this.reviews.length === 0) return 0;
   const sum = this.reviews.reduce((sum, review) => sum + review.rating, 0);
   return sum / this.reviews.length;
   //    TODO fix null value
});

tourSchema.virtual('numberOfReviews').get(function () {
   return this.reviews.length;
});

tourSchema.pre('save', function (next) {
   this.slug = slugify(this.name, { lower: true });
   this.$locals.isNew = this.isNew;
   next();
});

tourSchema.post('save', async function (doc) {
   if (doc.$locals.isNew) await mongoose.model('User').findByIdAndUpdate(doc.ownerId, { $push: { tours: doc._id } });
});

tourSchema.statics.deleteTour = async function (tourId) {
   const session = await mongoose.startSession();
   await session.startTransaction();
   try {
      const bookings = await mongoose.model('Booking').find({ tourId }).session(session).exec();
      const bookingIds = bookings.map((booking) => booking._id);

      await mongoose
         .model('User')
         .updateMany({ tours: tourId }, { $pull: { tours: tourId } }, { session })
         .exec();
      await mongoose
         .model('User')
         .updateMany({ bookings: { $in: bookingIds } }, { $pull: { bookingsId: { $in: bookingIds } } }, { session });
      await mongoose.model('Review').deleteMany({ tourId }, { session }).exec();
      await mongoose.model('Booking').deleteMany({ tourId }, { session });

      await this.findByIdAndDelete(tourId);
      await session.commitTransaction();
   } catch (err) {
      console.log(err);
      await session.abortTransaction();
   } finally {
      await session.endSession();
   }
};

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
