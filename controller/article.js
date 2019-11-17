const jwt  = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../util/db_query');
const moment = require('moment');
const { validationResult } = require('express-validator');

dotenv.config();
moment().format();
const JWT_SECRET_TOKEN = process.env.JWT_TOKEN_SECRET;

exports.createArticle = (req, res, next) => {

  //check article validation for title or article body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = errors.array();
    let errMsg = [];
    error.forEach(err => errMsg.push(err.msg));
    return res.status(422).json({
      status: 'error',
      error: errMsg,
    });
  }

  //Get the user Id from the database
  const token = req.headers.authorization.split(' ')[1];
  const decodeToken = jwt.verify(token, JWT_SECRET_TOKEN);
  const userId = decodeToken.userId;

  // Get the request title and article
  const title = req.body.title;
  const article = req.body.article;

  const conn = `INSERT INTO Article (userId, title, article, created_date) VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [
    userId,
    title,
    article,
    moment(new Date()),
  ];
  const result = db.query(conn, values);
  result
    .then((val) => {
      const { id: id, title: articleTitle, created_date: createdDate } = val.rows[0];
      return res.status(201).json({
            status: 'success',
            data: {
              message: 'Article successfully posted',
              articleId: id,
              createdOn: createdDate,
              title: articleTitle,
            },
          });
    })
    .catch(e =>
      res.status(500).json({
        status: 'error',
        error: 'Cannot store article',
      }));
};

exports.modifyArticle = (req, res, next) => {

  //check article validation for title or article body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = errors.array();
    let errMsg = [];
    error.forEach(err => errMsg.push(err.msg));
    return res.status(422).json({
      status: 'error',
      error: errMsg,
    });
  }

  const parameterId = req.params.id;
  const title = req.body.title;
  const article = req.body.article;

  const conn = `SELECT *
                FROM Article
                WHERE id = $1`;
  const result = db.query(conn, [parameterId]);
  result
    .then((value) => {
      if (!value.rows.length)
        return res.status(404).json({
          status: 'error',
          error: 'Article not found!',
        });
      const newConn = `UPDATE Article SET title = $1, article = $2  WHERE id = $3 RETURNING *`;
      const parameterValues = [
        title,
        article,
        value.rows[0].id,
      ];
      const newResult = db.query(newConn, parameterValues);
      newResult
        .then((result) => {
          const { articleId: id, title: articleTitle, article: article } = result.rows[0];
          return res.status(200).json({
            status: 'success',
            data: {
              articleId: id,
              message: 'Article successfully updated',
              title: articleTitle,
              article: article,
            },
          });
        })
        .catch((e) => {
          res.status(500).json({
            status: 'error',
            error: 'Cannot update article',
          });
        });
    })
    .catch(e =>
      res.status(401).json({
        status: 'error',
        error: 'Article not found!',
      }));
};

exports.deleteArticle = (req, res, next) => {

  const parameterId = req.params.id;

  const conn = `SELECT *
                FROM Article
                WHERE id = $1`;
  const result = db.query(conn, [parameterId]);
  result
    .then((dbResult) => {
      if (!dbResult.rows.length)
        return res.status(404).json({
          status: 'error',
          error: 'Article not found!',
        });
      const newConn = `DELETE FROM Article WHERE id= $1`;
      const parameterValues = [
        dbResult.rows[0].id,
      ];
      const newResult = db.query(newConn, parameterValues);
      newResult
        .then(() =>
          res.status(200).json({
            status: 'success',
            data: {
              message: 'Article successfully deleted!',
            },
          }))
        .catch(() => {
          res.status(500).json({
            status: 'error',
            error: 'Cannot delete article',
          });
        });
    })
    .catch(() => {
      res.status(500).json({
            status: 'error',
            error: 'Cannot delete article',
          });
    });
};
