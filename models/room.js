/**
 * Created by jbeckton on 2/10/16.
 */
var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    createdBy: {
        type: String,
        required:true
    }
});

module.exports = mongoose.model('Room', RoomSchema);