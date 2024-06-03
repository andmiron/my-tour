const { isAuthenticated } = require('../middlewares/authenticated');
const router = require('express').Router();
const { submitReviewValidator, validate } = require('../middlewares/validate');
const { submitReviewHandler } = require('../controllers/review.controller');

router.post('/', isAuthenticated, submitReviewValidator(), validate, submitReviewHandler);

module.exports = router;
