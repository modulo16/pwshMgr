const express = require('express');
const bodyParser = require('body-parser');
const api = require('./server/routes/api');
const app = express();
const io = require('socket.io').listen(app.listen(process.env.PORT || 8080));
const path = require('path');
const { exec } = require('child_process');
var cron = require('node-cron');
const bcrypt = require("bcryptjs");
const User = require('./server/models/user');
require('dotenv').config();

bcrypt.hash("pwshmgradmin", 10)
  .then(hash => {
    const user = new User({
      email: "admin@admin.admin",
      password: hash
    });
    user.save()
      .then(user => {
        console.log('created new user')
      })
      .catch(error => {
        console.log("user already created")
      });
  });

cron.schedule('*/10 * * * *', () => {
  let scriptPath = path.join(__dirname, './scripts/data_update.ps1');
  exec(`pwsh -file "${scriptPath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

io.sockets.on('connection', function (socket) {
  socket.on('room', function (room) {
    socket.join(room)
  });
});

app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use('/api', api);

app.use(express.static(__dirname + '/dist'));

app.get('*', function (req, res) {
  res.sendfile('./dist/index.html')
});

module.exports = app;