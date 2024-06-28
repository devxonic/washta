
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


const businessApprove = async (req, res) => {
    try {
        let business = await AdminFunctions.businessApprove(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const businessTerminate = async (req, res) => {
    try {
        let business = await AdminFunctions.businessTerminate(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- Job History -----------------------------------------------------//


const JobHistory = async (req, res) => {
    try {
        let business = await AdminFunctions.JobHistory(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- Top Comp / Cust -----------------------------------------------------//

const getTopCustomer = async (req, res) => {
    try {
        let business = await AdminFunctions.getTopCustomer(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const getTopCompanies = async (req, res) => {
    try {
        let business = await AdminFunctions.getTopCompanies(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- shop -----------------------------------------------------//


const getShop = async (req, res) => {
    try {
        let shop = await AdminFunctions.getShop(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getShopbyid = async (req, res) => {
    try {
        let shop = await AdminFunctions.getShopbyid(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const UpdateShopbyAmdin = async (req, res) => {
    try {
        let shop = await AdminFunctions.UpdateShopbyAmdin(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updateShopTiming = async (req, res) => {
    try {
        let shop = await AdminFunctions.updateShopTiming(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}



module.exports = {
    getBusinessbyStatus,
    updateStatus,
    businessApprove,
    businessTerminate,
    JobHistory,
    getTopCustomer,
    getTopCompanies,
    getShopbyid,
    getShop,
    UpdateShopbyAmdin,
    updateShopTiming
}