const path = require('path');
const express = require('express');
require('dotenv').config();

const db = require('./db/connection');

const routes = require('./routes');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

app.use('/', routes);

db.once('open', () => {
  console.log('DB connection established')
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});