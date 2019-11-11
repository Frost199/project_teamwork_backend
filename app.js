const express = require('express');
const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

//Connecting to database
let conString = process.env.TEAMWORK_DATABASE_URL;
let client = new pg.Client(conString);

client.connect((err) => {
  if (err)
    return console.error('could not connect to postgres:', err);
  else
    console.log('Successfully connected to elephantSQL!');
});

app.get('/', (req, res) => {
  res.send('Hello, welcome');
});

module.exports = app;
