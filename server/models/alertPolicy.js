var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alertPolicySchema = new Schema({
    name: String,
    type: String,
    machineId: String,
    threshold: String,
    item: String,
    priority: String
});

var AlertPolicy = mongoose.model('AlertPolicy', alertPolicySchema);

module.exports = AlertPolicy;