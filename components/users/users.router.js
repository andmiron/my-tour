const { isAuthenticated } = require('../../middlewares/isAuthenticated');
const UsersController = require('./users.controller');
const UsersValidator = require('./users.validator');
const uploadFile = require('../../services/multer');
const catchAsync = require('../../utils/catch.async');
const router = require('express').Router();

router.use(isAuthenticated);
router.route('/profile').get(catchAsync(UsersController.getMe)).delete(catchAsync(UsersController.deleteUser));
router
   .route('/photo')
   .post(uploadFile.single('inputPhoto'), catchAsync(UsersController.uploadUserPhoto))
   .put(catchAsync(UsersController.generatePhoto))
   .delete(catchAsync(UsersController.deletePhoto));
router.put(
   '/email',
   UsersValidator.validateChangeEmail(),
   UsersValidator.validate,
   catchAsync(UsersController.changeEmail),
);
router.put(
   '/password',
   UsersValidator.validateChangePassword(),
   UsersValidator.validate,
   catchAsync(UsersController.changePassword),
);

module.exports = router;
