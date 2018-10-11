const validateObjectId = require('../middleware/validateObjectId')
const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');
const mongoose = require('mongoose');
const status = require('http-status');
const Machine = require('../models/machine');
const checkAuth = require("../middleware/check-auth");

router.post('/', checkAuth, async (req, res) => {
    var newAlert = Alert({
        name: req.body.name,
        machineId: req.body.machineId,
        alertPolicyId: req.body.alertPolicyId,
        dateRaised: Date.now()
    });
    await newAlert.save()
    res.status(status.OK).json(newAlert);
});

router.get('/', checkAuth, async (req, res) => {
    const alerts = await Alert.find();
    res.send(alerts);
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