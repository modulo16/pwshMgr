const validateObjectId = require('../middleware/validateObjectId')
const express = require('express');
const router = express.Router();
const AlertPolicy = require('../models/alertPolicy');
var mongoose = require('mongoose');
var status = require('http-status');
const Machine = require('../models/machine');
const checkAuth = require("../middleware/check-auth");

// post new
router.post('/', checkAuth, async (req, res) => {
    var data = req.body;
    const machine = await Machine.findById(req.body.machineId);
    if (req.body.type == "drive") {
        var newAlertPolicy = AlertPolicy({
            name: `"${req.body.item}" drive free space below ${req.body.threshold}GB for "${machine.name}"`,
            type: data.type,
            machineId: data.machineId,
            threshold: data.threshold,
            item: data.item
        });
    }

    if (req.body.type == "service") {
        var newAlertPolicy = AlertPolicy({
            name: `"${req.body.item}" service stopped on "${machine.name}"`,
            type: data.type,
            machineId: data.machineId,
            threshold: data.threshold,
            item: data.item
        });
    }
    if (req.body.type == "process" && req.body.threshold == "is-running") {
        var newAlertPolicy = AlertPolicy({
            name: `"${req.body.item}" process running on "${machine.name}"`,
            type: data.type,
            machineId: data.machineId,
            threshold: data.threshold,
            item: data.item
        });
    }
    if (req.body.type == "process" && req.body.threshold == "not-running") {
        var newAlertPolicy = AlertPolicy({
            name: `"${req.body.item}" process not running on "${machine.name}"`,
            type: data.type,
            machineId: data.machineId,
            threshold: data.threshold,
            item: data.item
        });
    }
    await newAlertPolicy.save()
    res.status(status.OK).json(newAlertPolicy);
});

// get single
router.get('/:id', checkAuth, validateObjectId, async (req, res) => {
    const alertPolicy = await AlertPolicy.findById(req.params.id);
    if (!alertPolicy) return res.status(404).send('The alert policy with the given ID was not found.');
    res.send(alertPolicy)
});

// get all
router.get('/', checkAuth, (req, res) => {
    AlertPolicy.find({}, function (err, alertPolicies) {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        // object of all the machines
        res.status(status.OK).json(alertPolicies);
    });
});

// delete single
router.delete('/:alertPolicyId', checkAuth, async (req, res) => {
    await AlertPolicy.findByIdAndRemove(req.params.alertPolicyId);
    res.status(status.OK).json({ message: 'SUCCESS' });
});

module.exports = router;