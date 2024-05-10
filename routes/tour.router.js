const { createRandomTourHandler, getTourHandler } = require('../controllers/tour.controller');
const { getTourValidator, validate } = require('../middlewares/validate');
const router = require('express').Router();

router.post('/random', createRandomTourHandler);
router.get('/:slug', getTourValidator(), validate, getTourHandler);

module.exports = router;
