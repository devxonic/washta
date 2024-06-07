const CustomerModel = require("../models/Customer")
const SellerModel = require("../models/seller")

const updateRefreshToken = async (req, token, role) => {
    if (role == "customer") {
        let Customer = await CustomerModel.findOneAndUpdate({ username: req.body.username }, { $set: { sessionKey: token } })
        return Customer
    }
    if (role == "seller") {
        let seller = await SellerModel.findOneAndUpdate({ username: req.body.username }, { $set: { sessionKey: token } })
        return seller
    }
}

const getUser = async (req, role) => {

    if (role == "customer") {
        let Customer = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        return Customer;
    }
    if (role == "seller") {
        let Seller = await SellerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        return Seller;
    }
}
module.exports = {
    updateRefreshToken,
    getUser
}