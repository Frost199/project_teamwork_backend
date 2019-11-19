const express = require('express');
const feedController  = require('../controller/feed');

//middleware
const auth = require('../middleware/auth');

const router = express.Router();

//Create New Article
router.get('/', auth.userAuth, feedController.feed);

module.exports = router;
