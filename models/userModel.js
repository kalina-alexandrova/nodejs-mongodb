var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    email: String,
    forename: String,
    surname: String,
    badge: Number,
    dob: {
        type: Date,
        default: Date.now
    },
    isstudent: Boolean
});
module.exports = mongoose.model('User', userSchema);