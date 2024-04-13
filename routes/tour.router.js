const { createRandomTourHandler } = require('../controllers/tour.controller');
const router = require('express').Router();

router.post('/tour/random', createRandomTourHandler);

module.exports = router;
