const libs = require('../util/libs');
const db = require('../util/db_query');
const dotenv = require('dotenv');
const inquirer = require('inquirer');
const moment = require('moment');
const bcrypt = require('bcrypt');

moment().format();
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
           isAdmin      BOOLEAN             NOT NULL DEFAULT FALSE,
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

const confirmAnswerValidator = (input) => {
  if (input.length < 6)
    return 'Password should be greater than 6';
  return true;
};

const createAdmin = (val) => {
  let questions = [
    {
      type: 'input',
      name: 'firstName',
      message: "What's your First Name?",
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What\'s your Last Name?',
    },
    {
      type: 'input',
      name: 'email',
      validate: libs.isValidEmail,
      message: 'What\'s your Email?',
    },
    {
      type: 'password',
      name: 'password',
      mask: '*',
      validate: confirmAnswerValidator,
      message: 'What\'s your Password?',
    },
    {
      type: 'input',
      name: 'gender',
      message: 'What\'s your Gender?',
    },
    {
      type: 'input',
      name: 'jobRole',
      message: 'What\'s your Job Role?',
    },
    {
      type: 'input',
      name: 'department',
      message: 'What\'s your Department?',
    },
    {
      type: 'input',
      name: 'address',
      message: 'What\'s your Address?',
    },
  ];

  inquirer.prompt(questions)
    .then(async answers => {
      const firstName = answers.firstName;
      const lastName = answers.lastName;
      const email = answers.email;
      const password = answers.password;
      const gender = answers.gender;
      const jobRole = answers.jobRole;
      const department = answers.department;
      const address = answers.address;
      const isAdmin = true;
      const createDate = moment(new Date());

      bcrypt.hash(password, 10)
        .then((hash) => {
          const queryParams = [
            firstName,
            lastName,
            email,
            hash,
            gender,
            jobRole,
            department,
            address,
            isAdmin,
            createDate,
          ];
          const queryText = `INSERT INTO Employee
                             (firstName, lastName, email, password, gender, jobRole,
                              department, address, isAdmin,
                              created_date)
                             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

          db.query(queryText, queryParams)
            .then((res) => {
              console.log('Admin created');
              pool.end();
            })
            .catch((err) => {
              if (err.routine === '_bt_check_unique') {
                console.log('User with that EMAIL already exist');
              }

              pool.end();
            });
        });
    });
};

pool.on('remove', () => {
  console.log('connection closed');
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
  createAdmin,
};

require('make-runnable/custom')({
  printOutputFrame: false,
});
