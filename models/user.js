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
 * Create Users Tables
 */
const createTables = () => {
  const queryText =
      `CREATE TABLE IF NOT EXISTS
           Employee
       (
           id           SERIAL PRIMARY KEY,
           firstName    VARCHAR(128)        NOT NULL,
           lastName     VARCHAR(128)        NOT NULL,
           email        VARCHAR(128) UNIQUE NOT NULL,
           password     VARCHAR(128)        NOT NULL,
           gender       VARCHAR(128)        NOT NULL,
           jobRole      VARCHAR(128)        NOT NULL,
           department   VARCHAR(128)        NOT NULL,
           address      VARCHAR(256)        NOT NULL,
           created_date TIMESTAMP
       )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      console.log('Table Created');
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop USERS Tables
 */
const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS Employee';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
};

require('make-runnable');
