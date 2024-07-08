const router = require('express').Router();
const BookingsController = require('./bookings.controller');
const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const BookingsValidator = require('./bookings.validator');
const catchAsync = require('../../utils/catch.async');

router.post(
   '/checkout/create-session',
   isAuthenticated,
   BookingsValidator.validateCreateCheckoutSession(),
   BookingsValidator.validate,
   catchAsync(BookingsController.createCheckoutSession),
);
router.get('/', isAuthenticated, BookingsController.getMyBookings);
router.get('/:bookingId', isAuthenticated);
router.delete(
   '/:bookingId',
   isAuthenticated,
   BookingsValidator.validateDeleteBooking(),
   BookingsValidator.validate,
   BookingsController.deleteBooking,
);

module.exports = router;
