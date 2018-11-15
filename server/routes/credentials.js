const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const Creds = require('../models/credential');
const mongoose = require('mongoose');
const status = require('http-status');
const checkAuth = require("../middleware/check-auth");

router.get('/', checkAuth, async (req, res) => {
    const creds = await Creds.find();
    res.send(creds);
});

router.post('/', checkAuth, (req, res) => {
    var data = req.body;
    var newCredential = Creds({
        credentialName: data.credentialName,
        username: data.username,
        password: data.password
    });
    newCredential.save(function (err, cred) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json(cred);
    });
});

router.get('/:id', checkAuth, validateObjectId, async (req, res) => {
    const credential = await Creds.findById(req.params.id)
    if (!credential) return res.status(404).send('The credential with the given ID was not found.');
    res.send(credential);
});

router.delete('/:id', checkAuth, validateObjectId, async (req, res) => {
    await Creds.findByIdAndRemove(req.params.id);
    res.status(status.OK).json({ message: 'SUCCESS' });
});

module.exports = router;