const { createRandomTourHandler } = require('../controllers/tour.controller');
const router = require('express').Router();

router.post('/random', createRandomTourHandler);
router.get('/:slug');
router.post('/');

module.exports = router;
