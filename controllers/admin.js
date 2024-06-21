
const AdminFunctions = require('../functions/admin');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()


const getBusinessbyStatus = async (req, res) => {
    try {
        let business = await AdminFunctions.getBusinessbyStatus(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}




const updateStatus = async (req, res) => {
    try {
        let business = await AdminFunctions.updateStatus(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}





module.exports = {
    getBusinessbyStatus,
    updateStatus,
}