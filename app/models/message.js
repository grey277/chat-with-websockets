var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({nickname: String, message_type: String, message: String});

module.exports = mongoose.model('Message', messageSchema);
