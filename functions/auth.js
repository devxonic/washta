const CustomerModel = require("../models/Customer")
const SellerModel = require("../models/seller")
const OtpModel = require("../models/Otp")
const bcrypt = require("bcrypt")
const AdminModel = require("../models/admin")


const updateRefreshToken = async (req, token, role) => {
    if (role == "customer") {
        let Customer = await CustomerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { sessionKey: token } })
        return Customer
    }
    if (role == "seller") {
        let seller = await SellerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { sessionKey: token } })
        return seller
    }
    if (role == "admin") {
        let admin = await AdminModel.findOneAndUpdate({ username: req.body.identifier, role: req.body.role }, { $set: { sessionKey: token } })
        return admin
    }
    if (role == "agent") {
        let admin = await AdminModel.findOneAndUpdate({ username: req.body.identifier, role: req.body.role }, { $set: { sessionKey: token } })
        return admin
    }
}

const setDeviceId = async (req, role) => {
    if (role == "customer") {
        let Customer = await CustomerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { deviceId: req.body.deviceId } })
        return Customer
    }
    if (role == "seller") {
        let seller = await SellerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { deviceId: req.body.deviceId } })
        return seller
    }
    if (role == "admin") {
        let admin = await AdminModel.findOneAndUpdate({ username: req.body.identifier, role: req.body.role }, { $set: { deviceId: req.body.deviceId } })
        return admin
    }
    if (role == "agent") {
        let admin = await AdminModel.findOneAndUpdate({ username: req.body.identifier, role: req.body.role }, { $set: { deviceId: req.body.deviceId } })
        return admin
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
    if (role == "admin") {
        let Customer = await AdminModel.findOneAndUpdate({ email: req.body.email, role: "admin" }, { isVerifed: true }, { new: true });
        return Customer;
    }
    if (role == "agent") {
        let Customer = await AdminModel.findOneAndUpdate({ email: req.body.email, role: 'agent' }, { isVerifed: true }, { new: true });
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
    let isExpire = (currentDate - createdAt) > 1000 * 60 * 2
    console.log(isExpire)
    return !isExpire;

}


// ----------------------------------------------- Bookings -----------------------------------------------------//

const getAdminByEmail = async (req) => {

    let admin = await AdminModel.findOne({ $or: [{ username: req.body.username, role: req.body.role }, { email: req.body.email, role: req.body.role }] });
    return admin;
}

const getAgentByEmail = async (req) => {

    let admin = await AdminModel.findOne({ username: req.body.username, role: req.body.role });
    return admin;
}

const getAdmin = async (req) => {

    let admin = await AdminModel.findOne({ $or: [{ username: req.body.identifier, role: req.body.role }, { email: req.body.identifier, role: req.body.role }] });
    return admin;
}

const getAgent = async (req) => {

    let admin = await AdminModel.findOne({ username: req.body.identifier, role: req.body.role });
    return admin;
}

module.exports = {
    updateRefreshToken,
    getUser,
    MakeUserVerifed,
    getUserByEmail,
    resetPassword,
    isOTPAlreadySended,
    getAdminByEmail,
    getAgentByEmail,
    getAgent,
    getAdmin,
    setDeviceId,
}