const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: 'iopnxytv',
  host: 'salt.db.elephantsql.com',
  database: 'iopnxytv',
  password: 'gYVfD_df_4vqLi87UTx6u8JPKz8jkhdF',
  port: 5432,
});

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
