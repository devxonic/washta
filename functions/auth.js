const CustomerModel = require("../models/Customer")
const SellerModel = require("../models/seller")
const OtpModel = require("../models/Otp")
const bcrypt = require("bcrypt")


const updateRefreshToken = async (req, token, role) => {
    if (role == "customer") {
        let Customer = await CustomerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { sessionKey: token } })
        return Customer
    }
    if (role == "seller") {
        let seller = await SellerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { sessionKey: token } })
        return seller
    }
}

const getUser = async (req, role) => {

    if (role == "customer") {
        let Customer = await CustomerModel.findOne({ $or: [{ username: req.body.identifier }, { email: req.body.identifier }] });
        return Customer;
    }
    if (role == "seller") {
        let Seller = await SellerModel.findOne({ $or: [{ username: req.body.identifier }, { email: req.body.identifier }] });
        return Seller;
    }
}
const getUserByEmail = async (req, role) => {

    if (role == "customer") {
        let Customer = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        return Customer;
    }
    if (role == "seller") {
        let Seller = await SellerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        return Seller;
    }
}
const MakeUserVerifed = async (req, role) => {

    if (role == "customer") {
        let Customer = await CustomerModel.findOneAndUpdate({ email: req.body.email }, { isVerifed: true }, { new: true });
        return Customer;
    }
    if (role == "seller") {
        let Customer = await SellerModel.findOneAndUpdate({ email: req.body.email }, { isVerifed: true }, { new: true });
        return Customer;
    }
}

const resetPassword = async (email, password, role) => {
    let hash = await bcrypt.hash(password, 10);
    if (role == "customer") {
        let Customer = await CustomerModel.findOneAndUpdate({ email: email }, { password: hash }, { new: true });
        return Customer;
    }
    if (role == "seller") {
        let Customer = await SellerModel.findOneAndUpdate({ email: email }, { password: hash }, { new: true });
        return Customer;
    }
}

const isOTPAlreadySended = async (req) => {
    let OTP = await OtpModel.find({ email: req.body.email })
    if (OTP.length < 1) return false;
    let createdAt = new Date(OTP[OTP.length - 1]._doc.createdAt)
    let currentDate = new Date
    let isExpire = (currentDate - createdAt) > 120000
    console.log(isExpire)
    return !isExpire;

}

module.exports = {
    updateRefreshToken,
    getUser,
    MakeUserVerifed,
    getUserByEmail,
    resetPassword,
    isOTPAlreadySended
}