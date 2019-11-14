const libs = require('./libs');
const dotenv = require('dotenv');

dotenv.config();

const pool = libs.databaseEnv();

exports.query = (text, params) => pool.query(text, params);
