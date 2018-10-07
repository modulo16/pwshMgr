var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var credentialSchema = new Schema({
    credentialName: String,
    username: String,
    password: String
});

var Creds = mongoose.model('Credential', credentialSchema);

module.exports = Creds;