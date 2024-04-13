const { isAuthenticated } = require('../middlewares/authenticated');
const { deleteUserHandler } = require('../controllers/auth.contoller');
const router = require('express').Router();

router.delete('/profile', isAuthenticated, deleteUserHandler);

module.exports = router;
