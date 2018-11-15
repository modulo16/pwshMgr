const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var status = require('http-status');
const SlackIntegration = require('../models/integration');
const checkAuth = require("../middleware/check-auth");
const validateObjectId = require('../middleware/validateObjectId');

router.post('/', checkAuth, async (req, res) => {
    var data = req.body;
    var newSlackIntegration = SlackIntegration({
        name: req.body.name,
        webHook: req.body.webHook,
        type: "Slack"
    });
    await newSlackIntegration.save()
    res.status(status.OK).json(newSlackIntegration);
});

router.get('/', checkAuth, async (req, res) => {
    const slackIntegrations = await SlackIntegration.find();
    res.send(slackIntegrations);
});

router.delete('/:id', checkAuth, validateObjectId, async (req, res) => {
    await SlackIntegration.findByIdAndRemove(req.params.id);
    res.status(status.OK).json({ message: 'SUCCESS' });
});

router.get('/:id', checkAuth, validateObjectId, async (req, res) => {
    const integration = await SlackIntegration.findById(req.params.id)
    if (!integration) return res.status(404).send('The integration with the given ID was not found.')
    res.send(integration)
});

module.exports = router;