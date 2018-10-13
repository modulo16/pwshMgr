var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var slackIntegrationSchema = new Schema({
    name: String,
    webHook: String,
    type: String
});

var SlackIntegration = mongoose.model('SlackIntegration', slackIntegrationSchema);

module.exports = SlackIntegration;