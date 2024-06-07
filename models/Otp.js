const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },
  For : {
    type : String,
    enum : ["registration" , "forgetPassword"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1000 
  }
});


const Otp = mongoose.model('otp', otpSchema);
module.exports = Otp;
