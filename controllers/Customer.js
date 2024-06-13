
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
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const addVehicles = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.addVehicles(req)
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updateVehicles = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.updateVehicles(req)
        return response.resSuccessData(res, Vehicles);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const DeleteVehicle = async (req, res) => {
    try {
        let Vehicles = await CustomerFunctions.deleteVehicle(req)
        return response.resSuccessData(res, Vehicles);

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
}