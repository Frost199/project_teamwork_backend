const libs = require('../util/libs');
const dotenv = require('dotenv');
dotenv.config();

const pool = libs.databaseEnv();

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'testing')
    console.log('connected to the db');
  else
    console.log('connected to the test db');
});

/**
 * Create Gif Tables
 */
const createTable = () => {
  const queryText =
      `CREATE TABLE IF NOT EXISTS
           Article
       (
           id           SERIAL PRIMARY KEY,
           userId    INTEGER        NOT NULL,
           title     TEXT        NOT NULL,
           article        TEXT NOT NULL,
           created_date TIMESTAMP
       )`;

  pool.query(queryText)
    .then(() => {
      console.log('Table Created');
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop Gif Tables
 */
const dropTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Article';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log('Table dropped');
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('connection closed');
  process.exit(0);
});

module.exports = {
  createTable,
  dropTable,
};

require('make-runnable/custom')({
  printOutputFrame: false,
});
