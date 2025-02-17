const ToursController = require('./tours.controller');
const router = require('express').Router();
const multer = require('multer');
const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const upload = multer();
const ToursValidator = require('./tours.validator');

router.post('/randomInfo', isAuthenticated, ToursController.generateRandomInfo);
router
   .route('/')
   .get(ToursController.getAllTours)
   .post(
      isAuthenticated,
      upload.single('locImg'),
      ToursValidator.validateCreateTour(),
      ToursValidator.validate,
      ToursController.createTour,
   );
router.post(
   '/edit/:tourId',
   upload.single('locImg'),
   ToursValidator.validateEditTour(),
   ToursValidator.validate,
   ToursController.editTour,
);
router.get('/:slug', ToursValidator.validateGetTour(), ToursValidator.validate, ToursController.getTour);
router.delete('/:slug', ToursValidator.validateDeleteTour(), ToursValidator.validate, ToursController.deleteTour);

module.exports = router;
