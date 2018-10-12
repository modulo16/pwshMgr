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
const integrations = require('./integrations');
const Alert = require('../models/alert');
const Machine = require('../models/machine');
const checkAuth = require("../middleware/check-auth");

router.use('/machine', machines);
router.use('/job', jobs);
router.use('/user', users);
router.use('/credential', credentials);
router.use('/application', applications);
router.use('/script', scripts);
router.use('/alertpolicy', alertPolicies);
router.use('/alert', alerts);
router.use('/integration', integrations);

router.get('/count', async (req, res) => {
    const onlineMachines = await Machine.count({ status: 'Online' });
    const offlineMachines = await Machine.count({ status: 'Offline' });
    const alerts = await Alert.count();
    const count = {
        alerts: alerts,
        onlineMachines: onlineMachines,
        offlineMachines: offlineMachines
    }
    res.send(count)
});

module.exports = router;