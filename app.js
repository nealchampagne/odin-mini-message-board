const express = require('express');
const path = require('node:path');

const app = express();

const indexRouter = require('./routes/indexRouter');

const assetsPath = path.join(__dirname, 'public');

app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

// Use ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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