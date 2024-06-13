const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');

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

    let Customer = await CustomerModel.findOneAndUpdate({ email: req.user.email },
        { $set: { fullname: req.bodyfullName, phone: req.bodyphone } });
    let car = await VehiclesModel.findOneAndUpdate({ _id: req.body.car._id },
        { $set: { ...req.body.car } });

    let UpdatedRes = { ...Customer._doc }
    delete UpdatedRes.notification
    delete UpdatedRes.privacy
    delete UpdatedRes.security

    console.log(UpdatedRes, "Updated res")
    console.log(Customer)
    console.log(car)
    return { Customer: UpdatedRes, car };
}

const getProfile = async (req) => {
    let Customer = await CustomerModel.findOne({ username: req.user.username }, {
        password: 0, __v: 0, notification: 0,
        privacy: 0,
        security: 0,
        createdAt: 0,
        updatedAt: 0,
    });
    let car = await VehiclesModel.findOne({ $and: [{ Owner: Customer._id }, { isSelected: true }] }, { __v: 0 });
    return { Customer, car };
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
    console.log(req.user)
    if (req.user.role == "customer") {
        let User = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { sessionKey: '' } })
        return User
    }
    if (req.user.role == "seller") {
        let User = await SellerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { sessionKey: '' } })
        return User
    }
}


const getVehicles = async (req) => {
    let Vehicles = await VehiclesModel.find({ Owner: req.user.id });
    return Vehicles;
}

const addVehicles = async (req) => {
    let { vehicleManufacturer, vehiclePlateNumber, vehicleName, vehicleType } = req.body
    let newVehicle = VehiclesModel({
        Owner: req.user.id,
        vehicleManufacturer,
        vehiclePlateNumber,
        vehicleName,
        vehicleType
    })
    let Vehicle = await newVehicle.save();
    return Vehicle
}

const updateVehicles = async (req) => {
    let { id } = req.params
    let vehicle = await VehiclesModel.findByIdAndUpdate({ _id: id }, { $set: { ...req.body } })
    return vehicle
}

const deleteVehicle = async (req) => {
    let { id } = req.params
    let vehicle = await VehiclesModel.findByIdAndDelete({ _id: id })
    return vehicle
}

const getIsSelected = async (req) => {
    let Vehicles = await VehiclesModel.findOne({ $and: [{ Owner: req.user.id }, { isSelected: true }] });
    return Vehicles;
}

const updateIsSelected = async (req) => {
    let id = req.body.id
    let Vehicles = await VehiclesModel.findOneAndUpdate({ $and: [{ Owner: req.user.id }, { isSelected: true }] }, { isSelected: false });
    let Selected = await VehiclesModel.findOneAndUpdate({ $and: [{ Owner: req.user.id }, { _id: id }] }, { isSelected: true }, { new: true });
    return Selected;
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
    getVehicles,
    updateVehicles,
    addVehicles,
    deleteVehicle,
    getIsSelected,
    updateIsSelected,
}