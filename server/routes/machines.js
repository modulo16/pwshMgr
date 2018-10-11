const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const Machine = require('../models/machine');
const Group = require('../models/groups');
var mongoose = require('mongoose');
var status = require('http-status');
const Job = require('../models/job');
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
    const machine = await Machine.findById(req.params.id);
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

router.delete('/:id', checkAuth, async (req, res) => {
    await Machine.findByIdAndRemove(req.params.id);
    res.status(status.OK).json({ message: 'SUCCESS' });
});

router.get('/', checkAuth, (req, res) => {
    Machine.find({}, 'name _id operatingSystem status ipAddress', function (err, machines) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        console.log(machines.length)
        if (machines.length == "0"){
            console.log("no machines")
            return res.status(204).send()
        }
        res.status(status.OK).json(machines);
    });
});

router.put('/:id', checkAuth, validateObjectId, async (req, res) => {
    var data = req.body;
    var machineToUpdate = {
        name: data.name,
        serialNumber: data.serialNumber,
        operatingSystem: data.operatingSystem,
        applications: data.applications,
        services: data.services,
        make: data.make,
        model: data.model,
        architecture: data.architecture,
        dateAdded: data.dateAdded,
        dateUpdated: Date.now(),
        publicIp: data.publicIp,
        domain: data.domain,
        credential: data.credential,
        services: data.services,
        drives: data.drives,
        status: data.status,
        ipAddress: data.ipAddress,
        processes: data.processes
    };
    const machine = await Machine.findByIdAndUpdate(req.params.id, machineToUpdate, { new: true })
    req.io.sockets.in(req.params.id).emit('machineUpdate', machineToUpdate)
    res.status(status.OK).json(machineToUpdate);
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

module.exports = router;