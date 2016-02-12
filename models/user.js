/**
 * Created by jbeckton on 2/9/16.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


// Define our user schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
            sparse: true
        }
    },
    password: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    role: {
        type: String
    }

});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, callback) {

    bcrypt.compare(password, this.password, function(err, isMatch) {

        if (err) return callback(err);

        callback(null, isMatch);
    });
};

UserSchema.methods.checkIsEnabled = function(){
    return this.enabled;
};

UserSchema.methods.hasRole = function(role){
    return this.role === role;
};


// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);