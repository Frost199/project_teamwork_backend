const db = require('../util/db_query');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const moment = require('moment');

dotenv.config();
moment().format();

exports.signup = async (req, res, next) => {
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

  const hash = await bcrypt.hash(req.body.password, 10);
  const conn = `INSERT INTO Employee (firstName, lastName, email, password, gender,
                                      jobRole, department, address, created_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`;

  const values = [
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    hash,
    req.body.gender,
    req.body.jobRole,
    req.body.department,
    req.body.address,
    moment(new Date()),
  ];
  const result = db.query(conn, values);
  result
    .then((val) => {
      const _id = val.rows[0].id;
      const isAdmin = val.rows[0]['isadmin'];
      const token = jwt.sign(
        { userId: _id, isAdmin: isAdmin },
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: '24h' }
      );
      return res.status(201).json(
        {
          status: 'success',
          data: {
            message: 'User account successfully created',
            token: token,
            userId: _id,
          },
        });
    })
    .catch(e => {
      if (e.routine === '_bt_check_unique') {
        return res.status(400).json({
          status: 'error',
          error: 'User with that EMAIL already exist',
        });
      }

      return res.status(500).json({
        status: 'error',
        error: 'failed to create user',
      });
    });
};
