const { isAuthenticated } = require('../middlewares/isAuthenticated');
const {
   generatePhotoHandler,
   deletePhotoHandler,
   deleteUserHandler,
   changeEmailHandler,
   changePasswordHandler,
   uploadUserPhotoHandler,
   getMeHandler,
} = require('../controllers/user.controller');
const { changeEmailValidator, changePasswordValidator, validate } = require('../middlewares/validate');
const router = require('express').Router();

router.use(isAuthenticated);
router.route('/profile').get(getMeHandler).delete(deleteUserHandler);
router.route('/photo').post(uploadUserPhotoHandler).put(generatePhotoHandler).delete(deletePhotoHandler);
router.put('/email', changeEmailValidator(), validate, changeEmailHandler);
router.put('/password', changePasswordValidator(), validate, changePasswordHandler);

module.exports = router;
