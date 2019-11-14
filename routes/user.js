const express = require('express');
const userController  = require('../controller/user');
const validator = require('../middleware/validate_and_sanitize');
const router = express.Router();

router.post('/create-user', validator.validatedInput('createUser'), userController.signup);

module.exports = router;
