const dotenv = require('dotenv');
const db = require('../util/db_query');
const moment = require('moment');

dotenv.config();
moment().format();

exports.feed = (req, res, next) => {
  const conn = `SELECT id           as "articleId",
                       NULL         AS gifId,
                       userId       as "authorId",
                       title,
                       article,
                       NULL         as imageurl,
                       created_date as "createdOn"
                FROM Article
                UNION ALL
                SELECT NULL, id as "gifId", 
                       userId, title, 
                       NULL, imageurl, 
                       created_date as "createdOn"
                FROM Gif
                ORDER BY "createdOn" DESC`;
  const result = db.query(conn);
  result
    .then((queryResult) => {
      if (queryResult.rows.length > 0) {
        return res.status(200).json({
          status: 'success',
          data: queryResult.rows,
        });
      }else
        return res.status(200).json({
          status: 'success',
          data: 'No Article/Gif found, kindly post one',
        });
    })
    .catch(e =>
      res.status(500).json({
        status: 'error',
        error: 'Database error',
      })
    );
};
