const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');

const signUp = async (req) => {
    let newCustomer = new CustomerModel(req.body);
    let hash = await bcrypt.hash(req.body.password, 10);
    newCustomer.password = hash;
    let result = await newCustomer.save();
    return result;
}


const getSeller = async (req) => {

    let Customer = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    return Customer;
}
const findSeller = async (req) => {
    let player = await CustomerModel.findById(req.user.id);
    console.log("asdasdas", req.user.id, player)
    return player;
}

const updateRefreshToken = async (req, token) => {
    let player = await CustomerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { sessionKey: token } })
    return player
}


const signUpWithGoogle = async (req) => {
    let player = await CustomerModel.findOne({ email: req.body.identifier })
    console.log(player)
    if (player) {
        console.log('google user found')
        if (player.googleId === req.body.googleUser.id) return player
        throw new Error("incorrect details provided")
    }
    console.log('creating a new google user')
    req.body.googleId = req.body.googleUser.id
    req.body.email = req.body.identifier
    let newPlayer = new CustomerModel(req.body);
    let result = await newPlayer.save();
    return result;

}

const editProfile = async (req) => {
    const { name, phone } = req.body;
    let customer = await CustomerModel.findOneAndUpdate({ email: req.user.email },
        { $set: { name: name, phone: phone } });
    return customer;
}

const getProfile = async (req) => {
    let player = await CustomerModel.findOne({ username: req.user.username }, { password: 0, __v: 0 });
    return player;
}


const updateNotification = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { notification: req.body } })
    return player
}

const getNotification = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return player.notification;
}
const updatePrivacy = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { privacy: req.body } })
    return player
}

const getPrivacy = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return player.privacy;
}
const updateSecurity = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { security: req.body } })
    return player
}

const getSecurity = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return player.security;
}
const logout = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { sessionKey: '' } })
    return player
}


module.exports = {
    signUp,
    updateRefreshToken,
    signUpWithGoogle,
    getSeller,
    findSeller,
    getProfile,
    editProfile,
    logout,
    updateNotification,
    getNotification,
    updatePrivacy,
    getPrivacy,
    updateSecurity,
    getSecurity,
}