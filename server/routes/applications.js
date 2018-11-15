const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const mongoose = require('mongoose');
const status = require('http-status');
const checkAuth = require("../middleware/check-auth");
const validateObjectId = require('../middleware/validateObjectId');

router.post('/', checkAuth, (req, res) => {
    var data = req.body;
    var newApplication = Application({
        name: data.name,
        chocoInstallName: data.chocoInstallName
    });
    newApplication.save(function (err, application) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json(application);
    });
});

router.get('/:id', checkAuth, validateObjectId, async (req, res) => {
    const application = await Application.findById(req.params.id)
    if (!application) return res.status(404).send('The alert with the given ID was not found.')
    res.send(application)
});

router.get('/', checkAuth, async (req, res) => {
    const applications = await Application.find().sort('name');
    res.send(applications);
});

router.delete('/:id', checkAuth, validateObjectId, async (req, res) => {
    await Application.findByIdAndRemove(req.params.id);
    res.status(status.OK).json({ message: 'SUCCESS' });
});

module.exports = router;