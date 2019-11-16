const express = require('express');
const userController  = require('../controller/user');
const adminController  = require('../controller/admin');
const validator = require('../middleware/validate_and_sanitize');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create-user', auth.adminAuth, validator.validatedInput('createUser'),
  adminController.signup);
router.post('/signin', validator.validatedInput('loginUser'), userController.login);

module.exports = router;
