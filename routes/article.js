const express = require('express');
const articleController  = require('../controller/article');
const validator = require('../middleware/validate_and_sanitize');

//middleware
const auth = require('../middleware/auth');

const router = express.Router();

//Create New Article
router.post('/', auth.userAuth, validator.validatedInput('articleAdd'),
  articleController.createArticle);

//Get single Article
router.get('/:id', auth.userAuth, articleController.getSingleArticle);

//Modify Article
router.patch('/:id', auth.userAuth, validator.validatedInput('articleAdd'),
  articleController.modifyArticle);

//Delete Article
router.delete('/:id', auth.userAuth, articleController.deleteArticle);

//Comment on Article
router.post('/:id/comment', auth.userAuth, validator.validatedInput('articleComment'),
  articleController.commentArticle);

module.exports = router;
