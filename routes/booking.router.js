const router = require('express').Router();
const { createCheckoutSessionHandler } = require('../controllers/booking.controller');
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const { createCheckoutSessionValidator, validate } = require('../middlewares/validate');

router.post(
   '/checkout/:tourSlug',
   isAuthenticated,
   createCheckoutSessionValidator(),
   validate,
   createCheckoutSessionHandler,
);

module.exports = router;
