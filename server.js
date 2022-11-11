const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, 'board.html'));
});

app.listen(3001);
