const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

exports.isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

exports.databaseEnv = () => {
  let pool;

  if (process.env.NODE_ENV === 'testing') {
    pool = new Pool({
      user: 'wubncfbz',
      host: 'salt.db.elephantsql.com',
      database: 'wubncfbz',
      password: '8t0VtXbVQQmAIfnmax182SETdN6RgLmp',
      port: 5432,
    });
  } else {
    pool = new Pool({
      user: 'iopnxytv',
      host: 'salt.db.elephantsql.com',
      database: 'iopnxytv',
      password: 'gYVfD_df_4vqLi87UTx6u8JPKz8jkhdF',
      port: 5432,
    });
  }

  return pool;
};
