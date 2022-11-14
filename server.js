const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'board.html'));
});

app.use((req, res, next) => {
  res.redirect('/');
});


app.listen(3001);
