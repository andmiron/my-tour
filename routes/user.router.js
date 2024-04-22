const { isAuthenticated } = require('../middlewares/authenticated');
const {
   uploadUserPhotoHandler,
   generatePhotoHandler,
   deletePhotoHandler,
   deleteUserHandler,
   sendConfirmationEmailHandler,
   verifyEmailHandler,
} = require('../controllers/user.controller');
const router = require('express').Router();

router.put('/email/verify', verifyEmailHandler);
router.use(isAuthenticated);
router.put('/photo', uploadUserPhotoHandler);
router.post('/photoGenerate', generatePhotoHandler);
router.post('/email/verify', sendConfirmationEmailHandler);
router.delete('/photoDelete', deletePhotoHandler);
router.delete('/profile', deleteUserHandler);

module.exports = router;
