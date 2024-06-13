const SellerModel = require('../models/seller');
const ShopModel = require('../models/shop');
const bcrypt = require('bcrypt');
const response = require("../helpers/response");
const { default: mongoose } = require('mongoose');

const signUp = async (req) => {
    let newSeller = new SellerModel(req.body);
    let hash = await bcrypt.hash(req.body.password, 10);
    newSeller.password = hash;
    let result = await newSeller.save();
    return result;
}


const getSeller = async (req) => {

    let Seller = await SellerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    return Seller;
}

const getSellerByToken = async (req) => {

    let Seller = await SellerModel.findOne({ $or: [{ username: req.user.username }, { email: req.user.email }] });

    return Seller;
}
const findSeller = async (req) => {
    let Seller = await SellerModel.findById(req.user.id);
    console.log("asdasdas", req.user.id, Seller)
    return Seller;
}

const updateRefreshToken = async (req, token) => {
    let Seller = await SellerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { sessionKey: token } })
    return Seller
}


const signUpWithGoogle = async (req) => {
    let Seller = await SellerModel.findOne({ email: req.body.identifier })
    console.log(Seller)
    if (Seller) {
        console.log('google user found')
        if (Seller.googleId === req.body.googleUser.id) return Seller
        throw new Error("incorrect details provided")
    }
    console.log('creating a new google user')
    req.body.googleId = req.body.googleUser.id
    req.body.email = req.body.identifier
    let newSeller = new SellerModel(req.body);
    let result = await newSeller.save();
    return result;

}

const editProfile = async (req) => {
    const { name, phone } = req.body;
    let Seller = await SellerModel.findOneAndUpdate({ email: req.user.email },
        { $set: { name: name, phone: phone } }, { new: true });
    return Seller;
}

const getProfile = async (req) => {
    let Seller = await SellerModel.findOne({ username: req.user.username }, { password: 0, __v: 0 });
    return Seller;
}


const updateNotification = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { notification: req.body } })
    return Seller
}

const getNotification = async (req) => {
    let Seller = await SellerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return Seller.notification;
}
const updatePrivacy = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { privacy: req.body } })
    return Seller
}

const getPrivacy = async (req) => {
    let Seller = await SellerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return Seller.privacy;
}
const updateSecurity = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { security: req.body } })
    return Seller
}

const getSecurity = async (req) => {
    let Seller = await SellerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return Seller.security;
}
const logout = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { sessionKey: '' } })
    return Seller
}



// ----------------------------------------------- Business -----------------------------------------------------//

const addBusiness = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { business: req.body } })
    return Seller
}

// ----------------------------------------------- shops -----------------------------------------------------//

const getAllShop = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id })
    return Shops
}


const getShopById = async (req) => {
    let Shop = await ShopModel.findById(req.params.id)
    return Shop
}

const addShop = async (req) => {
    let Shop = await ShopModel({ ...req.body }).save();
    return Shop
}

const updateShop = async (req) => {
    let id = req.params.id
    let Shop = await ShopModel.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true })
    return Shop
}

const deleteShop = async (req) => {
    let Shop = await ShopModel.findByIdAndDelete(req.params.id)
    return Shop
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
    addBusiness,
    getSellerByToken,
    getAllShop,
    getShopById,
    addShop,
    deleteShop,
    updateShop,
}