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
         maxlength: [40, 'tour name must have less or equal than 40 characters'],
         minlength: [10, 'tour name must have more or equal than 10 characters'],
      },
      summary: {
         type: String,
         trim: true,
         required: [true, 'tour must have a summary'],
      },
      description: {
         type: String,
         trim: true,
         required: [true, 'tour must have a description'],
      },
      price: {
         type: Number,
         required: [true, 'tour must have a price'],
      },
      priceDiscount: {
         type: Number,
         validate: function (val) {
            return val < this.price;
         },
         message: 'discount price ({VALUE}) should be lower than the regular price',
      },
      duration: {
         type: Number,
         required: [true, 'tour must have a duration'],
      },
      maxGroupSize: {
         type: Number,
         required: [true, 'tour must have a group size'],
      },
      difficulty: {
         type: String,
         required: [true, 'tour must have a difficulty'],
         enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is [easy, medium or difficult]',
         },
      },
      ratingsAverage: {
         type: Number,
      },
      ratingsQuantity: {
         type: Number,
         default: 0,
      },
      startLocation: {
         type: {
            type: String,
            default: 'Point',
         },
         coordinates: [Number],
         address: String,
         description: String,
      },
      locations: [
         {
            type: {
               type: String,
               default: 'Point',
               enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
         },
      ],
      imageCover: {
         type: String,
      },
      guides: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
         },
      ],
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      timestamps: true,
   },
);

tourSchema.virtual('reviews', {
   ref: 'Review',
   localField: '_id',
   foreignField: 'tour',
});

tourSchema.pre('save', function (next) {
   this.slug = slugify(this.name, { lower: true });
   next();
});

tourSchema.pre(/^find/, function (next) {
   this.populate({
      path: 'guides',
      select: '-__v -passwordChangedAt',
   });

   next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
