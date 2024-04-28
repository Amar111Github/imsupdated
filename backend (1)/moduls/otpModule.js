
const mongoose = require('mongoose')

const OtpSchema = mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId, ref : 'user'},
    otp : { type : Number }
})

const otpModule = mongoose.model('otp', OtpSchema);

module.exports = otpModule