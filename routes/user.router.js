const { isAuthenticated } = require('../middlewares/authenticated');
const { deleteUserHandler } = require('../controllers/auth.contoller');
const { uploadUserPhotoHandler } = require('../controllers/user.controller');
const router = require('express').Router();

router.use(isAuthenticated);
router.delete('/profile', deleteUserHandler);
router.post('/photo', uploadUserPhotoHandler);

module.exports = router;
