const { isAuthenticated } = require('../middlewares/authenticated');
const {
   uploadUserPhotoHandler,
   generatePhotoHandler,
   deletePhotoHandler,
   deleteUserHandler,
   changeEmailHandler,
   changePasswordHandler,
} = require('../controllers/user.controller');
const { changeEmailValidator, changePasswordValidator, validate } = require('../middlewares/validate');
const router = require('express').Router();

router.use(isAuthenticated);
router.put('/email', changeEmailValidator(), validate, changeEmailHandler);
router.put('/password', changePasswordValidator(), validate, changePasswordHandler);
router.put('/photo', uploadUserPhotoHandler);
router.post('/photoGenerate', generatePhotoHandler);
router.delete('/photoDelete', deletePhotoHandler);
router.delete('/profile', deleteUserHandler);

module.exports = router;
