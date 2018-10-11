const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var status = require('http-status');
const SlackIntegration = require('../models/integration');
const checkAuth = require("../middleware/check-auth");

router.post('/', checkAuth, async (req, res) => {
    var data = req.body;
    var newSlackIntegration = SlackIntegration({
        name: req.body.name,
        webHook: req.body.webHook
    });
    await newSlackIntegration.save()
    res.status(status.OK).json(newSlackIntegration);
});

router.get('/', checkAuth, async (req, res) => {
    const slackIntegrations = await SlackIntegration.find();
    res.send(slackIntegrations);
});

module.exports = router;