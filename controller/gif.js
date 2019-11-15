const cloudinary = require('cloudinary').v2;
const db = require('../util/db_query');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const moment = require('moment');
const fs = require('fs');
const path  = require('path');

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

  process.chdir('../');
  const pathDir = path.resolve(path.join(process.cwd() + '/project_teamwork_backend/gifs/'));
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
          const { imageurl: imgUrl, id: id, title: imgTitle,
            created_date: createdDate, } = val.rows[0];

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
    .catch(e => console.log('Error: ', e.message));
};
