const jwt = require('jsonwebtoken');
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

  //Get the user Id
  const token = req.headers.authorization.split(' ')[1];
  const decodeToken = jwt.verify(token, JWT_SECRET_TOKEN);
  const userId = decodeToken.userId;

  // Get the request title and article
  const title = req.body.title;
  const article = req.body.article;

  const conn = `INSERT INTO Article (userId, title, article, created_date)
                VALUES ($1, $2, $3, $4) RETURNING *`;
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

exports.getSingleArticle = (req, res, next) => {
  const parameterId = req.params.id;
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
      const {
        id: articleId, title: articleTitle,
        article: articleContent, created_date: articleCreatedOn,
      } = value.rows[0];
      const articleCommentConn = `SELECT id           as "commentId",
                                         comment      as "comment",
                                         userid       as "authorId",
                                         created_date as "createdOn"
                                  FROM ArticleComment
                                  WHERE articleId = $1`;
      const commentResult = db.query(articleCommentConn, [articleId]);
      commentResult
        .then((value) => {
          if (!value.rows.length)
            return res.status(200).json({
              status: 'success',
              data: {
                id: articleId,
                createdOn: articleCreatedOn,
                title: articleTitle,
                article: articleContent,
                comments: [],
              },
            });
          return res.status(200).json({
            status: 'success',
            data: {
              id: articleId,
              createdOn: articleCreatedOn,
              title: articleTitle,
              article: articleContent,
              comments: value.rows,
            },
          });
        })
        .catch((e) => {
          res.status(500).json({
            status: 'error',
            error: 'Database Error',
          });
        });
    })
    .catch((e) => {
      res.status(500).json({
        status: 'error',
        error: 'Database Error',
      });
    });
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
      const newConn = `UPDATE Article
                       SET title   = $1,
                           article = $2
                       WHERE id = $3 RETURNING *`;
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
      const newConn = `DELETE
                       FROM Article
                       WHERE id = $1`;
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

exports.commentArticle = (req, res, next) => {

  //check if comment is valid in the body
  const reqErrors = validationResult(req);
  if (!reqErrors.isEmpty()) {
    let error = reqErrors.array();
    let errMessage = [];
    error.forEach(err => errMessage.push(err.msg));
    return res.status(422).json({
      status: 'error',
      error: errMessage,
    });
  }

  //Get the user Id
  const token = req.headers.authorization.split(' ')[1];
  const decodeToken = jwt.verify(token, JWT_SECRET_TOKEN);

  const userId = decodeToken.userId;
  const comment = req.body.comment;

  // Get Article from the database
  const parameterId = req.params.id;
  const conn = `SELECT *
                FROM Article
                WHERE id = $1`;
  const result = db.query(conn, [parameterId]);
  result
    .then(value => {
      if (!value.rows.length)
        return res.status(404).json({
          status: 'error',
          error: 'Article not found!',
        });
      const { id: articleId, title: articleTitle, article: article } = value.rows[0];
      const newConn = `INSERT INTO ArticleComment (userId, articleId,
                                                   comment, created_date)
                       VALUES ($1, $2, $3, $4) RETURNING *`;
      const newConnValues = [
        userId,
        articleId,
        comment,
        moment(new Date()),
      ];
      const commentResult = db.query(newConn, newConnValues);
      commentResult
        .then((responseCommentResult) => {
          const {
            id: commentId, comment: comment,
            created_date: createdOn,
          } = responseCommentResult.rows[0];
          return res.status(201).json({
            status: 'success',
            data: {
              message: 'Comment successfully created',
              createdOn: createdOn,
              articleTitle: articleTitle,
              article: article,
              commentId: commentId,
              comment: comment,
            },
          });
        })
        .catch(() =>
          res.status(500).json({
            status: 'error',
            error: 'Cannot store comment',
          }));
    })
    .catch(() =>
      res.status(500).json({
        status: 'error',
        error: 'Database connection issues',
      })
    );
};
