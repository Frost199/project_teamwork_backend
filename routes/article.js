const express = require('express');
const articleController  = require('../controller/article');
const validator = require('../middleware/validate_and_sanitize');

//middleware
const auth = require('../middleware/auth');

const router = express.Router();

//Create New thing
router.post('/', auth.userAuth, validator.validatedInput('articleAdd'),
  articleController.createArticle);

module.exports = router;
