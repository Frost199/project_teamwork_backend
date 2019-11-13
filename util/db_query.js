const libs = require('./libs');
const dotenv = require('dotenv');

dotenv.config();

const pool = libs.databaseEnv();

exports.query = (text, params) =>
  new Promise((resolve, reject) => {
    pool.query(text, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
