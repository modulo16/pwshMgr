const express = require('express');
const router = express.Router();
const Application = require('../models/application');
var mongoose = require('mongoose');
var status = require('http-status');
const checkAuth = require("../middleware/check-auth");

// application post
router.post('/', checkAuth, (req, res) => {
    var data = req.body;
    // create a new machine
    var newApplication = Application({
        name: data.name,
        chocoInstallName: data.chocoInstallName
    });
    newApplication.save(function (err, application) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json(application);
    });
});

//get application by ID
router.get('/:applicationId', checkAuth, (req, res) => {
    var applicationId = req.params.applicationId;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).send({
            message: 'job Id is invalid'
        });
    }
    Application.findById(applicationId, function (err, applicationFounded) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json(applicationFounded);
    });
});

/* GET all saved applications */
router.get('/', checkAuth, (req, res) => {
    Application.find({}, function (err, applications) {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        // object of all the machines
        res.status(status.OK).json(applications);
    });
});


router.delete('/:id', checkAuth, (req, res) => {
    Application.findByIdAndRemove(req.params.id, function (err) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json({ message: 'SUCCESS' });
    });
});

module.exports = router;