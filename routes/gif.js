const express = require('express');
const gifController  = require('../controller/gif');
const validator = require('../middleware/validate_and_sanitize');

//middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer_config');

const router = express.Router();

//Create New gif
router.post('/', auth.userAuth, validator.validatedInput('gifAdd'),
  multer, gifController.createGif);

//Delete a gif
router.delete('/:id', auth.userAuth, gifController.deleteGif);

//Comment on Gif
router.post('/:id/comment', auth.userAuth, validator.validatedInput('gifComment'),
  gifController.commentGif);

module.exports = router;
