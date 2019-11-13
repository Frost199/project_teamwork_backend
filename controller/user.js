const db = require('../util/db_query');
const bcrypt = require('bcrypt');
const moment = require('moment');
const libs = require('../util/libs');

moment().format();

exports.signup = async (req, res, next) => {
  let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;

  // check if email is a valid type
  if (!libs.isValidEmail(req.body.email)) {
    return res.status(400).json({
      status: 'error',
      error: 'Please enter a valid email address',
    });
  }

  bcrypt.hash(req.body.password, 10)
    .then(async (hash) => {
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
      try {
        const { rows } = await db.query(conn, values);
        return res.status(201).json({
          status: 'success',
          data: rows[0],
        });
      } catch (error) {
        if (error.routine === '_bt_check_unique') {
          return res.status(400).json({
            status: 'error',
            data: 'User with that EMAIL already exist',
          });
        }

        return res.status(500).json({
          status: 'error',
          data: 'failed to create user',
        });
      }
    });
};
