const express = require('express');
const pg = require('pg');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//Routes
const userRoutes = require('./routes/user');

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

//avoiding CORS(Cross Origin Resource Sharing), this adds to the headed
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,' +
    ' Content, Accept, Content-Type,' +
    ' Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, welcome');
});

app.use(bodyParser.json());
app.use('/api/v1/auth', userRoutes);

module.exports = app;
