const express = require('express');
const router = express.Router();
const Script = require('../models/script');
var mongoose = require('mongoose');
var status = require('http-status');
const validateObjectId = require('../middleware/validateObjectId');
const checkAuth = require("../middleware/check-auth");

router.post('/', checkAuth, async (req, res) => {
    const script = new Script({
        name: req.body.name,
        scriptBody: req.body.scriptBody
    });
    await script.save();
    res.send(script);
});

//get script
router.get('/:id', checkAuth, validateObjectId, async (req, res) => {
    const script = await Script.findById(req.params.id);
    if (!script) return res.status(404).send('The script with the given ID was not found.');
    res.send(script)
});

/* GET all saved scripts */
router.get('/', checkAuth, async (req, res) => {
    try {
        const scripts = await Script.find()
        res.status(status.OK).json(scripts);
    }
    catch (ex) {
        res.status(500).send('Something failed.')
    }
});

// delete script
router.delete('/:id', checkAuth, (req, res) => {
    Script.findByIdAndRemove(req.params.id, function (err) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json({ message: 'SUCCESS' });
    });
});

module.exports = router;