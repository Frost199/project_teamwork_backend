const express = require('express');
const pg = require('pg');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

//Routes
const userRoutes = require('./routes/user');
const gifRoutes = require('./routes/gif');
const articleRoutes = require('./routes/article');
const feedRoutes = require('./routes/feed');

dotenv.config();
const app = express();

//Connecting to database
let conString = process.env.TEAMWORK_DATABASE_URL;
let client = new pg.Client(conString);

//avoiding CORS(Cross Origin Resource Sharing), this adds to the headed
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,' +
    ' Content, Accept, Content-Type,' +
    ' Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('/gifs', express.static(path.join(__dirname, 'gifs')));
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/gifs', gifRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/feed', feedRoutes);

module.exports = app;
