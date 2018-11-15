require('dotenv').config();
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

bcrypt.hash(process.env.ADMINPW, 10)
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

//Every 1 minutes
cron.schedule('*/1 * * * *', () => {
  let scriptPath = path.join(__dirname, './scripts/data_update.ps1');
  exec(`pwsh -file ${scriptPath} -ApiPwd ${process.env.ADMINPW} -PollCycle 1`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

//Every 5 minutes
cron.schedule('*/5 * * * *', () => {
  let scriptPath = path.join(__dirname, './scripts/data_update.ps1');
  exec(`pwsh -file ${scriptPath} -ApiPwd ${process.env.ADMINPW} -PollCycle 5`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

//Every 10 minutes
cron.schedule('*/10 * * * *', () => {
  let scriptPath = path.join(__dirname, './scripts/data_update.ps1');
  exec(`pwsh -file ${scriptPath} -ApiPwd ${process.env.ADMINPW} -PollCycle 10`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

//Every 15 minutes
cron.schedule('*/15 * * * *', () => {
  let scriptPath = path.join(__dirname, './scripts/data_update.ps1');
  exec(`pwsh -file ${scriptPath} -ApiPwd ${process.env.ADMINPW} -PollCycle 15`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

//Every 30 minutes
cron.schedule('*/30 * * * *', () => {
  let scriptPath = path.join(__dirname, './scripts/data_update.ps1');
  exec(`pwsh -file ${scriptPath} -ApiPwd ${process.env.ADMINPW} -PollCycle 30`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

//Every 60 minutes
cron.schedule('0 * * * *', () => {
  let scriptPath = path.join(__dirname, './scripts/data_update.ps1');
  exec(`pwsh -file ${scriptPath} -ApiPwd ${process.env.ADMINPW} -PollCycle 60`, (err, stdout, stderr) => {
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