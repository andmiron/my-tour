const Booking = require('../bookings/bookings.model');
const BaseRepository = require('../../common/BaseRepository');

class BookingRepository extends BaseRepository {
   constructor() {
      super(Booking);
   }
}

module.exports = new BookingRepository();
