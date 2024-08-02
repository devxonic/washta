
const AdminFunctions = require('../functions/admin');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()


const getBusinessbyStatus = async (req, res) => {
    try {
        let business = await AdminFunctions.getBusinessbyStatus(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking Please Add Status")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}
const getAllBusniess = async (req, res) => {
    try {
        let business = await AdminFunctions.getAllBusniess(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking Please Add Status")
        return response.resSuccessData(res, business);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}
const getBusinessById = async (req, res) => {
    try {
        let business = await AdminFunctions.getBusinessById(req)
        if (!business) return response.resBadRequest(res, "couldn't find Booking Please Add Status")
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

const businessReject = async (req, res) => {
    try {
        let business = await AdminFunctions.businessReject(req)
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



// ----------------------------------------------- customer -----------------------------------------------------//


const getCustomer = async (req, res) => {
    try {
        let shop = await AdminFunctions.getCustomer(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getCustomerByid = async (req, res) => {
    try {
        let shop = await AdminFunctions.getCustomerByid(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updateCustomer = async (req, res) => {
    try {
        let shop = await AdminFunctions.updateCustomer(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}
const getVehicles = async (req, res) => {
    try {
        let shop = await AdminFunctions.getVehicles(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}
const getvehiclesById = async (req, res) => {
    try {
        let shop = await AdminFunctions.getvehiclesById(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}
const updateVehicles = async (req, res) => {
    try {
        let shop = await AdminFunctions.updateVehicles(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

// ----------------------------------------------- service Fee -----------------------------------------------------//

const getserviceFee = async (req, res) => {
    try {
        let shop = await AdminFunctions.getserviceFee(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getserviceFeeById = async (req, res) => {
    try {
        let shop = await AdminFunctions.getserviceFeeById(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Service fee")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const createServiceFee = async (req, res) => {
    try {
        let shop = await AdminFunctions.createServiceFee(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updateServiceFee = async (req, res) => {
    try {
        let shop = await AdminFunctions.updateServiceFee(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- service Fee -----------------------------------------------------//


const getPromoCode = async (req, res) => {
    try {
        let shop = await AdminFunctions.getPromoCode(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Promo Code")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getPromoCodeById = async (req, res) => {
    try {
        let shop = await AdminFunctions.getPromoCodeById(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Promo Code")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const createPromoCode = async (req, res) => {
    try {
        let shop = await AdminFunctions.createPromoCode(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Promo Code")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updatePromoCode = async (req, res) => {
    try {
        let shop = await AdminFunctions.updatePromoCode(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Promo Code")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

// ----------------------------------------------- Review -----------------------------------------------------//

const getShopReviews = async (req, res) => {
    try {
        let shop = await AdminFunctions.getShopReviews(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Reviews")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getSellerReviews = async (req, res) => {
    try {
        let shop = await AdminFunctions.getShopReviews(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Reviews")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getOrderReviews = async (req, res) => {
    try {
        let shop = await AdminFunctions.getShopReviews(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Reviews")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getCustomerReviews = async (req, res) => {
    try {
        let shop = await AdminFunctions.getCustomerReviews(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Reviews")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const replyToReview = async (req, res) => {
    try {
        let shop = await AdminFunctions.replyToReview(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Reviews")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const editMyReplys = async (req, res) => {
    try {
        let shop = await AdminFunctions.replyToReview(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Reviews")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const deleteReviews = async (req, res) => {
    try {
        let shop = await AdminFunctions.deleteReviews(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Reviews")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}




module.exports = {
    updateStatus,
    businessApprove,
    businessTerminate,
    JobHistory,
    getTopCustomer,
    getTopCompanies,
    getShopbyid,
    getShop,
    UpdateShopbyAmdin,
    updateShopTiming,
    getCustomer,
    getCustomerByid,
    updateCustomer,
    getserviceFee,
    createServiceFee,
    getserviceFeeById,
    updateServiceFee,
    createPromoCode,
    getPromoCode,
    getPromoCodeById,
    updatePromoCode,
    getVehicles,
    getvehiclesById,
    updateVehicles,
    getAllBusniess,
    getBusinessById,
    businessReject,
    getBusinessbyStatus,
    getShopReviews,
    replyToReview,
    editMyReplys,
    deleteReviews,
    getSellerReviews,
    getOrderReviews,
    getCustomerReviews,
}