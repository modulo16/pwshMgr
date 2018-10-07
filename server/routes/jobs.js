const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const Job = require('../models/job');
var mongoose = require('mongoose');
var status = require('http-status');
const http = require('http');
const Machine = require('../models/machine')
const Application = require('../models/application')
const Script = require('../models/script')
const checkAuth = require("../middleware/check-auth");

/* POST: save and start a new job */
router.post('/', checkAuth, async (req, res) => {
    const machine = await Machine.findById(req.body.machine);
    if (req.body.script) {
        const script = await Script.findById(req.body.script)
        var newJob = Job({
            name: `Deploy ${script.name} script to ${machine.name}`,
            machine: req.body.machine,
            script: req.body.script,
            status: "Scheduled",
            dateAdded: Date.now(),
            output: null,
            type: "Script"
        })
    }
    if (req.body.application) {
        const application = await Application.findById(req.body.application);
        var newJob = Job({
            name: `Deploy ${application.name} to ${machine.name}`,
            machine: req.body.machine,
            application: application.chocoInstallName,
            status: "Scheduled",
            dateAdded: Date.now(),
            output: null,
            type: "Choco Application Install"
        })
    }
    await newJob.save()
    res.status(status.OK).json(newJob);
    //start job run
    var exec = require('child_process').exec;
    if (req.body.application) {
        let scriptPath = require("path").resolve(__dirname, '../../scripts/install_choco_app.ps1')
        let command = `pwsh -file ${scriptPath} -machineID ${machine._id} -jobID ${newJob._id}`
        exec(command, function callback(error, stdout, stderr) {
            console.log(stdout)
            if (!stderr) {
                console.log("no error found")
                newJob.output = stdout
                newJob.status = "Completed"
                newJob.finishDate = Date.now()
                Job.findByIdAndUpdate(newJob._id, newJob, function (err, job) {
                    Job.findById(newJob._id, function (err, jobFounded) {
                        req.io.sockets.in(newJob._id).emit('jobUpdate', jobFounded)
                    });
                });
            } else {
                console.log(stderr)
                console.log("error found")
                newJob.output = stderr
                newJob.status = "Failed"
                newJob.finishDate = Date.now()
                Job.findByIdAndUpdate(newJob._id, newJob, function (err, job) {
                    Job.findById(newJob._id, function (err, jobFounded) {
                        req.io.sockets.in(newJob._id).emit('jobUpdate', jobFounded)

                    });
                });
            }
        });
    }
    if (req.body.script) {
        let scriptPath = require("path").resolve(__dirname, '../../scripts/script_runner.ps1')
        let command = `pwsh -file ${scriptPath} -machineID ${machine._id} -ScriptID ${req.body.script}`
        exec(command, function callback(error, stdout, stderr) {
            if (!stderr) {
                console.log("no error found")
                newJob.output = stdout
                newJob.status = "Completed"
                newJob.finishDate = Date.now()
                Job.findByIdAndUpdate(newJob._id, newJob, function (err, job) {
                    Job.findById(newJob._id, function (err, jobFounded) {
                        req.io.sockets.in(newJob._id).emit('jobUpdate', jobFounded)
                    });
                });
            } else {
                console.log(stderr)
                console.log("error found")
                newJob.output = stderr
                newJob.status = "Failed"
                newJob.finishDate = Date.now()
                Job.findByIdAndUpdate(newJob._id, newJob, function (err, job) {
                    Job.findById(newJob._id, function (err, jobFounded) {
                        req.io.sockets.in(newJob._id).emit('jobUpdate', jobFounded)
                    });
                });
            }

        });
    }


});

//get job by ID
router.get('/:id', checkAuth, validateObjectId, async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('The job with the given ID was not found.');
    if (job.group) {
        const subJobs = await Job.find({ masterJob: req.params.id })
        var jobDetails = {
            _id: job._id,
            name: job.name,
            application: job.application,
            status: job.status,
            startDate: job.startDate,
            group: job.group,
            subJob: job.subjob,
            finishData: job.finishDate,
            subJobs: subJobs
        }
        return res.send(jobDetails)
    }
    res.send(job)
});

/* GET all saved jobs */
router.get('/', checkAuth, async (req, res) => {
    try {
        // const jobs = await Job.find({ subJob: false }).sort('-startDate')
        const jobs = await Job.find().sort('-dateAdded')
        res.status(status.OK).json(jobs);
    }
    catch (ex) {
        res.status(500).send('Something failed.')
    }
});

/* PUT: update a new job */
router.put('/', checkAuth, (req, res) => {
    var data = req.body;
    var id = data._id;

    if (data.status == "Finished") {
        var jobToUpdate = {
            name: data.name,
            machine: data.machine,
            application: data.application,
            status: data.status,
            startDate: data.startDate,
            dateAdded: data.dateAdded,
            finishDate: Date.now()
        }
    }

    if (data.status == "Running") {
        var jobToUpdate = {
            name: data.name,
            machine: data.machine,
            application: data.application,
            status: data.status,
            startDate: Date.now(),
            dateAdded: data.dateAdded
        }
    }

    // find the machine with id :id
    Job.findByIdAndUpdate(id, jobToUpdate, function (err, job) {
        Job.findById(id, function (err, jobFounded) {
            req.io.sockets.in(id).emit('jobUpdate', jobFounded)
            console.log(id)
            console.log(jobFounded)
            res.status(status.OK).json(jobFounded);
        });
    });
});

router.get('/subjobs/:subJobId', checkAuth, (req, res) => {
    var subJobId = req.params.subJobId;
    Job.find({ masterJob: subJobId }, function (err, jobs) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json(jobs);
    });
});


router.delete('/:id', checkAuth, (req, res) => {
    Job.findByIdAndRemove(req.params.id, function (err) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        res.status(status.OK).json({ message: 'SUCCESS' });
    });
});

module.exports = router;