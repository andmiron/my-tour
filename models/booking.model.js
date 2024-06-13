const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
   {
      tourId: {
         type: mongoose.Schema.ObjectId,
         ref: 'Tour',
         required: [true, 'Booking must belong to a Tour!'],
      },
      userId: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'Booking must belong to a User!'],
      },
      price: {
         type: Number,
         min: 1,
         required: [true, 'Booking must have a price.'],
      },
      isPaid: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true },
);

// bookingSchema.post('save', async function (doc) {
//    await mongoose.model('User').findByIdAndUpdate(doc.userId, { $push: { bookings: doc._id } });
// });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
