const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
   {
      stripeSessionId: {
         type: String,
         required: true,
         unique: true,
      },
      tourId: {
         type: mongoose.Schema.ObjectId,
         ref: 'Tour',
         required: [true, 'Booking must belong to a Tour!'],
      },
      ownerId: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'Booking must belong to a User!'],
      },
   },
   { timestamps: true },
);

bookingSchema.post('save', async function (doc, next) {
   await mongoose.model('User').findByIdAndUpdate(doc.userId, { $push: { bookings: doc._id } });
   next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
