const express = require('express');
const path = require('node:path');
require('dotenv').config();
const app = express();
const methodOverride = require('method-override');
const fs = require('node:fs');

const caCertPath = path.join(__dirname, 'temp-ca.pem');
fs.writeFileSync(caCertPath, process.env.CA_CERT);

// This tells Express to look for a query param like ?_method=DELETE
app.use(methodOverride('_method'));

const indexRouter = require('./routes/index');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use ejs view engine
app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.resolve('public')));

// Routes
app.use('/', indexRouter);

// Handle errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mini Message Board - listening on port ${PORT}!`);
});