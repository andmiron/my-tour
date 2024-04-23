const { isAuthenticated } = require('../middlewares/authenticated');
const {
   uploadUserPhotoHandler,
   generatePhotoHandler,
   deletePhotoHandler,
   deleteUserHandler,
} = require('../controllers/user.controller');
const router = require('express').Router();

router.use(isAuthenticated);
router.put('/photo', uploadUserPhotoHandler);
router.post('/photoGenerate', generatePhotoHandler);
router.delete('/photoDelete', deletePhotoHandler);
router.delete('/profile', deleteUserHandler);

module.exports = router;
