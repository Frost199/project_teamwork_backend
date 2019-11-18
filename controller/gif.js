const cloudinary = require('cloudinary').v2;
const db = require('../util/db_query');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

dotenv.config();
moment().format();
const JWT_SECRET_TOKEN = process.env.JWT_TOKEN_SECRET;

exports.createGif = async (req, res, next) => {

  //Get user Id
  const token = req.headers.authorization.split(' ')[1];
  const decodeToken = jwt.verify(token, JWT_SECRET_TOKEN);
  const userId = decodeToken.userId;

  //Handle file errors
  if (req.fileValidationError) return res.status(400).json({
    status: 'error',
    error: req.fileValidationError,
  });
  else if (!req.file)
    return res.status(400).json({
      status: 'error',
      error: 'File upload missing',
    });

  let title = req.body.title;
  let fileName;

  fileName = req.file.filename;
  let name = fileName.split('.gif')[0];
  const pathDir = path.resolve(path.join(process.cwd() + '/gifs'));
  cloudinary.uploader.upload(`${pathDir}/${fileName}`,
    { public_id: `teamwork/${name}`, tags: 'teamwork' })
    .then((image) => {

      const cloudinaryImageUrl = image.url;
      const cloudinaryImagePublicId = image.public_id;

      // remove file from server
      fs.unlinkSync(`${pathDir}/${fileName}`);

      const conn = `INSERT INTO Gif (userId, title, imageUrl, image_public_id, created_date)
                    VALUES ($1, $2, $3, $4, $5) returning *`;

      const values = [
        userId,
        title,
        cloudinaryImageUrl,
        cloudinaryImagePublicId,
        moment(new Date()),
      ];

      const result = db.query(conn, values);
      result
        .then((val) => {
          const {
            imageurl: imgUrl, id: id, title: imgTitle,
            created_date: createdDate,
          } = val.rows[0];

          return res.status(201).json({
            status: 'success',
            data: {
              gifId: id,
              message: 'GIF image successfully posted',
              createdOn: createdDate,
              title: imgTitle,
              imageUrl: imgUrl,
            },
          });
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
};

exports.deleteGif = (req, res, next) => {
  const parameterId = req.params.id;
  const conn = `SELECT *
                FROM Gif
                WHERE id = $1`;
  const result = db.query(conn, [parameterId]);
  result
    .then((dbResult) => {
      if (!dbResult.rows.length)
        return res.status(404).json({
          status: 'error',
          error: 'Gif not found!',
        });
      const { image_public_id: imagePublicId, id: gifId } = dbResult.rows[0];
      cloudinary.uploader.destroy(imagePublicId)
        .then(() => {
          const newConn = `DELETE
                           FROM Gif
                           WHERE id = $1`;
          const newResult = db.query(newConn, [gifId]);
          newResult
            .then(() =>
              res.status(200).json({
                status: 'success',
                data: {
                  gifId: gifId,
                  message: 'gif post successfully deleted',
                },
              }))
            .catch(() =>
              res.status(500).json({
                status: 'error',
                error: 'Cannot delete article',
              }));
        })
        .catch(() =>
          res.status(404).json({
            status: 'error',
            error: 'Image not found on server',
          })
        );
    })
    .catch(() =>
      res.status(500).json({
        status: 'error',
        error: 'Cannot delete article',
      })
    );
};

exports.commentGif = (req, res, next) => {

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
  const comment  = req.body.comment;

  // Get Gif from the database
  const parameterId = req.params.id;
  const conn = `SELECT *
                FROM Gif
                WHERE id = $1`;
  const result = db.query(conn, [parameterId]);
  result
    .then(value => {
      if (!value.rows.length)
        return res.status(404).json({
          status: 'error',
          error: 'Gif not found!',
        });
      const { id: gifId, title: gifTitle, } = value.rows[0];
      const newConn = `INSERT INTO GifComment (userId, gifId, 
                            comment, created_date) VALUES ($1, $2, $3, $4) RETURNING *`;
      const newConnValues = [
        userId,
        gifId,
        comment,
        moment(new Date()),
      ];
      const gifResult = db.query(newConn, newConnValues);
      gifResult
        .then((responseGifResult) => {
          const { id: commentId, comment: comment,
            created_date: createdOn, } = responseGifResult.rows[0];
          return res.status(201).json({
            status: 'success',
            data: {
              message: 'Comment successfully created',
              createdOn: createdOn,
              gifTitle: gifTitle,
              gifCommentId: commentId,
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
