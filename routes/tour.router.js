const { getTourHandler, createTourHandler, generateRandomInfoHandler } = require('../controllers/tour.controller');
const { getTourValidator, validate, createTourValidator } = require('../middlewares/validate');
const router = require('express').Router();
const multer = require('multer');
const { isAuthenticated } = require('../middlewares/authenticated');
const upload = multer();

router.post('/randomInfo', isAuthenticated, generateRandomInfoHandler);
router.get('/:slug', getTourValidator(), validate, getTourHandler);
router.post('/', isAuthenticated, upload.single('startLocImg'), createTourValidator(), validate, createTourHandler);

module.exports = router;
