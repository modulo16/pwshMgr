const validateObjectId = require('../middleware/validateObjectId')
const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');
var mongoose = require('mongoose');
var status = require('http-status');
const Machine = require('../models/machine');
const checkAuth = require("../middleware/check-auth");

// POST new alert
router.post('/', checkAuth, async (req, res) => {
    var data = req.body;
    var newAlert = Alert({
        name: req.body.name,
        machineId: req.body.machineId,
        alertPolicyId: req.body.alertPolicyId,
        dateRaised: Date.now()
    });
    await newAlert.save()
    res.status(status.OK).json(newAlert);
});

/* GET all saved alert policies */
router.get('/', checkAuth, (req, res) => {
    Alert.find({}, function (err, alerts) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        // object of all the machines
        res.status(status.OK).json(alerts);
    });
});

router.delete('/:id', checkAuth, async (req, res) => {
    await Alert.findByIdAndRemove(req.params.id);
    res.status(status.OK).json({ message: 'SUCCESS' });
});

router.get('/:id', checkAuth, validateObjectId, async (req, res) => {
    const alert = await Alert.findById(req.params.id)
    if (!alert) return res.status(404).send('The alert with the given ID was not found.')
    res.send(alert)
});

module.exports = router;