require('dotenv').config();
const uristring = process.env.MONGODBPATH
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect(uristring)
    .then(connection => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log(error.message)
    });

const machines = require('./machines');
const users = require('./users');
const applications = require('./applications');
const jobs = require('./jobs');
const credentials = require('./credentials');
const scripts = require('./scripts');
const alertPolicies = require('./alertPolicies');
const alerts = require('./alerts')
const integrations = require('./integrations')

router.use('/machine', machines);
router.use('/job', jobs);
router.use('/user', users);
router.use('/credential', credentials);
router.use('/application', applications);
router.use('/script', scripts);
router.use('/alertpolicy', alertPolicies);
router.use('/alert', alerts);
router.use('/integration', integrations)

module.exports = router;