var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
    name: String,
    chocoInstallName: String
});

var Application = mongoose.model('Application', applicationSchema);

module.exports = Application;