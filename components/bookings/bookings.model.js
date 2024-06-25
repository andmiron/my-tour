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
      isPaid: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true },
);

bookingSchema.post('save', async function (doc, next) {
   await mongoose.model('User').findByIdAndUpdate(doc.userId, { $push: { bookings: doc._id } });
   next();
});

bookingSchema.statics.deleteBooking = async function (bookingId) {
   const session = await mongoose.startSession();
   await session.startTransaction();
   try {
      await mongoose.model('User').updateOne({ bookings: bookingId }, { $pull: { bookings: bookingId } }, { session });
      await this.findByIdAndDelete(bookingId);
      await session.commitTransaction();
   } catch (err) {
      await session.abortTransaction();
   } finally {
      await session.endSession();
   }
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
