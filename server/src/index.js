const express = require('express');
// morgan logs metadata about incoming requests
const morgan = require('morgan');
// helmet prevents clients from seeing the framework used in the backend, increasing security
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const dotenv = require('dotenv');
const result = dotenv.config();

const middlewares = require('./middlewares');
const logs = require('./api/logs');

const app = express();

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database.');
  })
  .catch((err) => {
    console.log('Not Connected to Database ERROR! ', err);
  });

app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/api/logs', logs);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}...`);
});
