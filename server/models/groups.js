var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name: String
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;