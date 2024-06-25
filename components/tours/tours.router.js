const ToursController = require('./tours.controller');
const router = require('express').Router();
const multer = require('multer');
const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const upload = multer();
const catchAsync = require('../../utils/catch.async');
const ToursValidator = require('./tours.validator');

router
   .route('/')
   .get(catchAsync(ToursController.getAllTours))
   .post(
      isAuthenticated,
      upload.single('locImg'),
      ToursValidator.validateCreateTour(),
      ToursValidator.validate,
      catchAsync(ToursController.createTour),
   );
router.get('/:slug', ToursValidator.validateGetTour(), ToursValidator.validate, catchAsync(ToursController.getTour));
router.post('/randomInfo', isAuthenticated, catchAsync(ToursController.generateRandomInfo));

module.exports = router;
