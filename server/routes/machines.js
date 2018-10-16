const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const Machine = require('../models/machine');
const Group = require('../models/groups');
const mongoose = require('mongoose');
const status = require('http-status');
const Job = require('../models/job');
const Alert = require('../models/alert');
const checkAuth = require("../middleware/check-auth");

router.get('/count', (req, res) => {
    Machine.count({}, function (err, count) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        var object = {
            count: count.toString()
        }
        res.status(status.OK).json(object);
    });
});

router.get('/:id', checkAuth, validateObjectId, async (req, res) => {
    const machine = await Machine.findById(req.params.id, '-services -applications -processes');
    if (!machine) return res.status(404).send('The machine with the given ID was not found.');
    res.send(machine);
});

router.get('/:id/drives', validateObjectId, async (req, res) => {
    const machine = await Machine.findById(req.params.id, 'drives -_id');
    if (!machine) return res.status(404).send('The machine with the given ID was not found.');
    res.send(machine);
});

// update status
router.post('/offline/:id', checkAuth, validateObjectId, async (req,res) => {
    const machine = await Machine.findById(req.params.id);
    machine.status = "Offline"
    await Machine.findByIdAndUpdate(req.params.id, machine, {new:true})
    req.io.sockets.in(req.params.id).emit('machineUpdate', machine)
    res.status(status.OK).json({message: 'Success'});
})

router.delete('/:id', checkAuth,validateObjectId, async (req, res) => {
    await Machine.findByIdAndRemove(req.params.id);
    res.status(status.OK).json({ message: 'SUCCESS' });
});

router.get('/', checkAuth, async (req, res) => {
    const machines = await Machine.find({},'name _id operatingSystem status ipAddress credential');
    res.send(machines);
});

router.put('/:id', checkAuth, validateObjectId, async (req, res) => {
    const machine = await Machine.findById(req.params.id)
    machine.name = req.body.name
    machine.operatingSystem = req.body.operatingSystem
    machine.architecture = req.body.architecture
    machine.serialNumber = req.body.serialNumber
    machine.applications = req.body.applications
    machine.make = req.body.make
    machine.model = req.body.model
    machine.publicIp = req.body.publicIp
    machine.domain = req.body.domain
    machine.services = req.body.services
    machine.processes = req.body.processes
    machine.drives = req.body.drives
    machine.dateUpdated = Date.now()
    const updatedMachine = await Machine.findByIdAndUpdate(req.params.id, machine, { new: true })
    req.io.sockets.in(req.params.id).emit('machineUpdate', updatedMachine)
    res.status(status.OK).json(updatedMachine);
});

router.post('/', checkAuth, async (req, res) => {
    var data = req.body;
    var newMachine = Machine({
        ipAddress: data.ipAddress,
        credential: data.credential,
        dateAdded: Date.now(),
        status: "Online"
    });
    const machine = await newMachine.save()
    res.send(machine)
});

router.get('/jobs/:id', checkAuth, (req, res) => {
    Job.find({ machine: req.params.id }, '_id name dateAdded status', function (err, jobs) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json(jobs);
    });
});

router.get('/alerts/:id', checkAuth, validateObjectId, (req, res) => {
    Alert.find({ machineId: req.params.id }, '_id name lastOccurred priority', function (err, alerts) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json(alerts);
    });
});

router.get('/alerts/:id', checkAuth, validateObjectId, async (req, res) => {
    const alerts = await Alert.find({ machineId: req.params.id }, '_id name lastOccurred priority');
    res.send(alerts);
});

module.exports = router;