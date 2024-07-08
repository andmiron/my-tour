const { body, param } = require('express-validator');
const Tour = require('../tours/tours.model');
const Booking = require('../bookings/bookings.model');
const AppError = require('../../common/AppError');
const BaseValidator = require('../../common/BaseValidator');

class BookingsValidator extends BaseValidator {
   constructor() {
      super();
   }

   validateCreateCheckoutSession() {
      return [
         body('tourSlug').custom(async (tourSlug, { req }) => {
            const tour = await Tour.findOne({ slug: tourSlug }).exec();
            if (!tour) return Promise.reject(AppError.badRequest('Invalid tour id!'));
            req.body.tour = tour;
         }),
      ];
   }

   validateDeleteBooking() {
      return [
         param('bookingId')
            .isMongoId()
            .custom(async (id, { req }) => {
               const booking = await Booking.findById(id).exec();
               if (!booking) return Promise.reject('There is no such booking!');
               if (booking.ownerId.toString() !== req.user.id) {
                  console.log(booking.ownerId.toString());
                  console.log(req.user.id);
                  return Promise.reject('You can only delete your own booking!');
               }
            }),
      ];
   }
}

module.exports = new BookingsValidator();
