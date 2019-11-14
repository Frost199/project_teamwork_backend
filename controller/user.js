const db = require('../util/db_query');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const moment = require('moment');

dotenv.config();
moment().format();

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = errors.array();
    let errMsg = [];
    error.forEach(err => errMsg.push(err.msg));
    return res.status(422).json({
      status: 'error',
      errors: errMsg,
    });
  }

  const conn = `SELECT *
                FROM Employee
                WHERE email = $1`;
  const result = db.query(conn, [req.body.email]);
  result
    .then((result) => {
      if (!result.rows.length)
        return res.status(401).json({
          status: 'error',
          error: 'User not found!',
        });
      bcrypt.compare(req.body.password, result.rows[0].password)
        .then(valid => {
          const _id = result.rows[0].id;
          const isAdmin = result.rows[0]['isadmin'];
          if (!valid)
            return res.status(401).json({
              status: 'error',
              error: 'Incorrect password',
            });

          const token = jwt.sign(
            { userId: _id, isAdmin: isAdmin },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '24h' }
          );

          res.status(200).json({
            status: 'success',
            data: {
              token: token,
              userId: _id,
            },
          });
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            status: 'error',
            error: 'Could not login user',
          });
        });
    });
};
