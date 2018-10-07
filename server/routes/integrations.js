const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var status = require('http-status');
const SlackIntegration = require('../models/integration');
const checkAuth = require("../middleware/check-auth");

// POST new integration
router.post('/', checkAuth, async (req, res) => {
    var data = req.body;
    var newSlackIntegration = SlackIntegration({
        name: req.body.name,
        webHook: req.body.webHook
    });
    await newSlackIntegration.save()
    res.status(status.OK).json(newSlackIntegration);
});

router.get('/', checkAuth, (req, res) => {
    SlackIntegration.find({}, function (err, slackIntegrations) {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        // object of all the machines
        res.status(status.OK).json(slackIntegrations);
    });
});

module.exports = router;