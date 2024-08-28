const CustomerModel = require('../models/Customer');
const SellerModel = require('../models/seller');
const bcrypt = require('bcrypt');

const validateEmailUsername = async (req, role) => {
    console.log(req.body.username, req.body.email);
    if (role == "customer") {
        let existing = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (existing) return true;
        return false;
    }
    if (role == "seller") {
        let existing = await SellerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (existing) return true;
        return false;
    }
}
const validateUserExitsByEmail = async (req, role) => {
    console.log(req.body.email);

    if (role == "customer") {
        let existing = await CustomerModel.findOne({ email: req.body.email });
        if (existing) return true;
        return false;
    }
    if (role == "seller") {
        let existing = await SellerModel.findOne({ email: req.body.email });
        if (existing) return true;
        return false;
    }
}

const validateEmailUsernameSignUp = async (req, role) => {
    console.log(req.body.username, req.body.email);

    if (role == "customer") {
        let existing = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (existing) return true;
        return false;
    }
    if (role == "seller") {
        let existing = await SellerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (existing) return true;
        return false;
    }
}

const verifyPassword = async (password, hash) => {
    let match = await bcrypt.compare(password, hash);
    console.log('match testing', match);
    return match;
}


module.exports = {
    validateEmailUsernameSignUp,
    validateUserExitsByEmail,
    validateEmailUsername,
    verifyPassword,
}

