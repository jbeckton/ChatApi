/**
 * Created by jbeckton on 2/10/16.
 */
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    createdOn: {type: Date}
});

module.exports = mongoose.model('Message', MessageSchema);