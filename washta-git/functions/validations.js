const CustomerModel = require('../models/Customer');
// // const courtModel = require('../models/courtOwner');
// // const courtFields = require('../models/court');
// // const bookingModel = require('../models/booking');

const bcrypt = require('bcrypt');

const validateEmailUsername = async (req) => {
    console.log(req.body.username, req.body.email);
    let existing = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (existing) return true;
    return false;
}

const validateEmailUsernameSignUp = async (req) => {
    console.log(req.body.username, req.body.email);
    let existing = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (existing) return true;
    return false;
}

// const validateCourtEmailUsername = async (req) => {
//     console.log(req.body.username, req.body.email);
//     let existing = await courtModel.findOne({ $or: [{ username: req.body.identifier }, { email: req.body.identifier }] });
//     if (existing) return true;
//     return false;
// }

// const validateCourtEmailUsernameSignUp = async (req) => {
//     console.log(req.body.username, req.body.email);
//     let existing = await courtModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
//     if (existing) return true;
//     return false;
// }

const verifyPassword = async (password, hash) => {
    let match = await bcrypt.compare(password, hash);
    console.log('match testing', match);
    return match;
}

// const isTimeSlotAvailable = async (req) => {
//     let timeslotarr = [];
//     req.body.timeslots.forEach(item => {
//         timeslotarr.push((item.id));
//     })
//     let timeslotBooked = await bookingModel.findOne({ fieldId: req.body.fieldId, Date: req.body.date, "bookings.timeslots": { $in: timeslotarr } });
//     console.log('timeslot bookbed', timeslotBooked);
//     if (timeslotBooked) return false;
//     else return true;
// }

// validateEmailUsername,
// verifyPassword,
// validateCourtEmailUsername,
// validateCourtEmailUsernameSignUp,
// isTimeSlotAvailable,

module.exports = {
    validateEmailUsernameSignUp,
    validateEmailUsername,
    verifyPassword,
}

