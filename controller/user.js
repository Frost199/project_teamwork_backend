const db = require('../util/db_query');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const moment = require('moment');

moment().format();

exports.signup = async (req, res, next) => {
  let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let error = errors.array();
    let errMsg = [];
    error.forEach(err => errMsg.push(err.msg));
    return res.status(422).json({ errors: errMsg });
  }

  const hash = await bcrypt.hash(req.body.password, 10);
  const conn = `INSERT INTO Employee (firstName, lastName, email, password, gender,
                                      jobRole, department, address, created_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

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
    .then(() =>
      res.status(201).json({
        status: 'success',
        data: 'User created',
      }))
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
