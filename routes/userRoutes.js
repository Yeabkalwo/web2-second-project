const router = require('express').Router();
const controller = require('../controller/userController');

router.get('/register', controller.getRegisterPage);
router.get('/login', controller.getLoginPage);

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);
router.post('/logout', controller.logoutUser);

module.exports = router;