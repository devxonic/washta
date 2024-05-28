
const CustomerFunctions = require('../functions/Customer');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()


const getProfile = async (req, res) => {
    try {
        let Customer = await CustomerFunctions.getProfile(req);
        return response.resSuccessData(res, Customer);
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}

const editProfile = async (req, res) => {
    try {
        let user = await CustomerFunctions.CheckUserisExist(req.body.username);
        if(!user){
            let Customer = await CustomerFunctions.editProfile(req);
            if (Customer) return response.resSuccessData(res, "updated");
            return response.resBadRequest(res);
        }else{
            return response.resBadRequest(res, "This User Name is Already taken");

        }
    }
    catch (error) {
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
module.exports = {
    getProfile,
    getSecuritySetting,
    updateSecuritySetting,
    updateNotificationSetting,
    getNotificationSetting,
    getPrivacySetting,
    editProfile

}