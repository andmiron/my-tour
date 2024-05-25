const { getTourHandler, createTourHandler, generateRandomInfoHandler } = require('../controllers/tour.controller');
const { getTourValidator, validate, createTourValidator } = require('../middlewares/validate');
const router = require('express').Router();
const multer = require('multer');
const upload = multer();

router.post('/randomInfo', generateRandomInfoHandler);
router.get('/:slug', getTourValidator(), validate, getTourHandler);
router.post('/', upload.none(), createTourValidator(), validate, createTourHandler);

module.exports = router;
