const {
   getTourHandler,
   createTourHandler,
   generateRandomInfoHandler,
   getMyToursHandler,
   getAllTours,
} = require('../controllers/tour.controller');
const { getTourValidator, validate, createTourValidator } = require('../middlewares/validate');
const router = require('express').Router();
const multer = require('multer');
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const upload = multer();

router
   .route('/')
   .get(getAllTours)
   .post(isAuthenticated, upload.single('locImg'), createTourValidator(), validate, createTourHandler);
router.get('/:slug', getTourValidator(), validate, getTourHandler);
router.post('/randomInfo', isAuthenticated, generateRandomInfoHandler);

module.exports = router;
