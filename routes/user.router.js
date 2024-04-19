const { isAuthenticated } = require('../middlewares/authenticated');
const { deleteUserHandler } = require('../controllers/auth.contoller');
const { uploadUserPhotoHandler, generatePhotoHandler, deletePhotoHandler } = require('../controllers/user.controller');
const router = require('express').Router();

router.use(isAuthenticated);
router.get('/me', (req, res) => {
   res.status(200).send(req.user);
});
router.delete('/profile', deleteUserHandler);
router.put('/photo', uploadUserPhotoHandler);
router.post('/photoGenerate', generatePhotoHandler);
router.delete('/photoDelete', deletePhotoHandler);

module.exports = router;
