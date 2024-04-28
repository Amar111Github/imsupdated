
const mongoose = require('mongoose');
const bcript = require('bcrypt')
const SALT_FACTOUR = 10;

const userSchema = mongoose.Schema({
    userName: { type: String, require: true },
    userEmail: { type: String, require: true },
    contactNo: { type: String, require: true },
    userPass: { type: String, require: true },
})


const userModule = mongoose.model('users', userSchema);

module.exports = userModule