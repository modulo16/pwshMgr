var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alertSchema = new Schema({
    name: String,
    machineId: String,
    alertPolicyId: String,
    dateRaised: Number,
    priority: String,
    occurrenceCount: Number,
    lastOccurred: Number
});

var Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;