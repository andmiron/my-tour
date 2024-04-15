const { isAuthenticated } = require('../middlewares/authenticated');
const { deleteUserHandler } = require('../controllers/auth.contoller');
const { uploadUserPhotoHandler } = require('../controllers/user.controller');
const { upload } = require('../utils/multer');
const router = require('express').Router();

router.use(isAuthenticated);
router.delete('/profile', deleteUserHandler);
router.post('/photo', upload.single('inputPhoto'), (req, res) => {});

module.exports = router;
