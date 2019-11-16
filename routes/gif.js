const express = require('express');
const gifController  = require('../controller/gif');
const validator = require('../middleware/validate_and_sanitize');

//middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer_config');

const router = express.Router();

//Create New thing
router.post('/', auth.userAuth, validator.validatedInput('gifAdd'),
  multer, gifController.createGif);

module.exports = router;
