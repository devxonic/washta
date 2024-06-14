
const CustomerFunctions = require('../functions/Customer');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()


const getProfile = async (req, res) => {
    try {
        let User = await CustomerFunctions.getProfile(req);
        return response.resSuccessData(res, { ...User.Customer._doc, car: User.car });
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}
const editProfile = async (req, res) => {
    try {
        let User = await CustomerFunctions.editProfile(req);
        return response.resSuccessData(res, { ...User.Customer, car: User.car });
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}



// ----------------------------------------------- Customer settings -----------------------------------------------------//

const updateNotificationSetting = async (req, res) => {
    try {

        let notification = await CustomerFunctions.updateNotification(req)
        return response.resSuccessData(res, "updated");

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}

const getNotificationSetting = async (req, res) => {
    try {

        let notification = await CustomerFunctions.getNotification(req)
        return response.resSuccessData(res, notification);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}


const updatePrivacySetting = async (req, res) => {
    try {

        let privacy = await CustomerFunctions.updatePrivacy(req)
        return response.resSuccessData(res, "updated");

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}

const getPrivacySetting = async (req, res) => {
    try {

        let privacy = await CustomerFunctions.getPrivacy(req)
        return response.resSuccessData(res, privacy);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}


const updateSecuritySetting = async (req, res) => {
    try {

        let security = await CustomerFunctions.updateSecurity(req)
        return response.resSuccessData(res, "updated");

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}

const getSecuritySetting = async (req, res) => {
    try {

        let security = await CustomerFunctions.getSecurity(req)
        return response.resSuccessData(res, security);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- Vehicles -----------------------------------------------------//



const getVehicles = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.getVehicles(req)
        if (!Vehicles) return response.resBadRequest(res, "couldn't find Vehicle")
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const addVehicles = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.addVehicles(req)
        if (!Vehicles) return response.resBadRequest(res, "couldn't find Vehicle")
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updateVehicles = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.updateVehicles(req)
        if (!Vehicles) return response.resBadRequest(res, "couldn't find Vehicle")
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const DeleteVehicle = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.deleteVehicle(req)
        if (!Vehicles) return response.resBadRequest(res, "couldn't find Vehicle")
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getIsSelected = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.getIsSelected(req)
        if (!Vehicles) return response.resBadRequest(res, "couldn't find Vehicles")
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updateIsSelected = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.updateIsSelected(req)
        if (!Vehicles) return response.resBadRequest(res, "couldn't find Vehicles")
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- shop -----------------------------------------------------//


const getAllShops = async (req, res) => {
    try {
        let shop = await CustomerFunctions.getAllShops(req)
        if (!shop) return response.resBadRequest(res, "couldn't find shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getShopById = async (req, res) => {
    try {
        let Shop = await CustomerFunctions.getShopById(req)
        if (!Shop) return response.resBadRequest(res, "couldn't find shop")
        return response.resSuccessData(res, Shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- Booking -----------------------------------------------------//


const getMyBookings = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getMyBookings(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getMyBookingById = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getMyBookingById(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const createNewBooking = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.createNewBooking(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

module.exports = {
    getProfile,
    editProfile,
    getPrivacySetting,
    updateNotificationSetting,
    getNotificationSetting,
    updatePrivacySetting,
    updateSecuritySetting,
    getSecuritySetting,
    getVehicles,
    addVehicles,
    updateVehicles,
    DeleteVehicle,
    getIsSelected,
    updateIsSelected,
    getAllShops,
    getShopById,
    getMyBookings,
    getMyBookingById,
    createNewBooking,
}