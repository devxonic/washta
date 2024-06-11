const CustomerModel = require("../models/Customer")
const SellerModel = require("../models/seller")

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
        let Customer = await CustomerModel.findOne({ $or: [{ username: req.body.email }, { email: req.body.username }] });
        return Customer;
    }
    if (role == "seller") {
        let Seller = await SellerModel.findOne({ $or: [{ username: req.body.email }, { email: req.body.username }] });
        return Seller;
    }
}
const MakeUserVerifed = async (req, role) => {

    if (role == "customer") {
        let Customer = await CustomerModel.findOneAndUpdate({ email: req.body.email }, { isVerifed: true });
        return Customer;
    }
    if (role == "seller") {
        let Customer = await SellerModel.findOneAndUpdate({ email: req.body.email }, { isVerifed: true });
        return Customer;
    }
}
module.exports = {
    updateRefreshToken,
    getUser,
    MakeUserVerifed
}