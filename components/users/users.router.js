const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const UsersController = require('./users.controller');
const UsersValidator = require('./users.validator');
const uploadFile = require('../../services/multer');
const router = require('express').Router();

router.use(isAuthenticated);
router.route('/profile').get(UsersController.getMe).delete(UsersController.deleteUser);
router
   .route('/photo')
   .post(uploadFile.single('inputPhoto'), UsersController.uploadUserPhoto)
   .delete(UsersController.deletePhoto);
router.put('/email', UsersValidator.validateChangeEmail(), UsersValidator.validate, UsersController.changeEmail);
router.put(
   '/password',
   UsersValidator.validateChangePassword(),
   UsersValidator.validate,
   UsersController.changePassword,
);

module.exports = router;
