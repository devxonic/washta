
const AdminFunctions = require('../functions/admin');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminModel = require('../models/admin');
const sharp = require('sharp');
const { s3UploadObject } = require('../middlewares');
require('dotenv').config()





const updatePassword = async (req, res) => {
    try {
        let { newPassword, previousPassword } = req.body
        let getAdmin = await AdminModel.findOne({ _id: req.user.id }, { password: 1 })
        if (!getAdmin) return response.resBadRequest(res, "User Not Found")
        let match = await validationFunctions.verifyPassword(previousPassword, getAdmin.password)
        console.log("match ----------", match)
        if (!match) return response.resBadRequest(res, "incorrect Previous Password");
        let hash = await bcrypt.hash(newPassword, 10);
        // return response.resSuccess(res, User);
        let admin = await AdminModel.findOneAndUpdate({ _id: req.user.id }, { $set: { password: hash } }, {
            new: true, fields: {
                username: 1,
                email: 1,
                phone: 1
            }
        })

        return response.resSuccessData(res, admin);
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}

const uplaodAvatar = async (req, res) => {
    try {

        console.log('testing req file', req.file)
        // console.log('testing req file', req.file)
        if (!req.file) {
            console.log(req.files)
            console.log("No file received");
            return res.sendStatus(204);

        } else {
            console.log("file Size", req.file.size)
            const resizedImageBuffer = await sharp(req.file.buffer)
                .resize(200, 200) // Example dimensions
                .jpeg({ quality: 80 })
                .toBuffer()

            console.log("Buffer resized", resizedImageBuffer)
            console.log("file Size", resizedImageBuffer)
            let originalImage = await s3UploadObject(req.file.buffer, req.file.originalname, req.file.mimetype)
            let resizedImage = await s3UploadObject(resizedImageBuffer, req.file.originalname, req.file.mimetype)
            let updateImage = await AdminFunctions.updateImage(req, resizedImage, originalImage);
            console.log('file received', updateImage);
            return response.resSuccessData(res, updateImage);
        }

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}

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

const getTopSellers = async (req, res) => {
    try {
        let business = await AdminFunctions.getTopSellers(req)
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


const terminateShop = async (req, res) => {
    try {
        let shop = await AdminFunctions.terminateShop(req)
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

const terminateCustomer = async (req, res) => {
    try {
        let shop = await AdminFunctions.terminateCustomer(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const deleteOrderByCustomerId = async (req, res) => {
    try {
        let shop = await AdminFunctions.deleteOrderByCustomerId(req)
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
const getVehiclesByCustomerId = async (req, res) => {
    try {
        let shop = await AdminFunctions.getVehiclesByCustomerId(req)
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

// ----------------------------------------------- stats -----------------------------------------------------//


const getAllTimeStats = async (req, res) => {
    try {
        let Stats = await AdminFunctions.getAllTimeStats(req)
        if (!Stats) return response.resBadRequest(res, "couldn't find any Data")
        return response.resSuccessData(res, Stats);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getstatsbyMonth = async (req, res) => {
    try {
        let Stats = await AdminFunctions.getstatsbyMonth(req)
        if (!Stats) return response.resBadRequest(res, "couldn't find any Data")
        return response.resSuccessData(res, Stats);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const getStatsByWeek = async (req, res) => {
    try {
        let Stats = await AdminFunctions.getStatsByWeek(req)
        if (!Stats) return response.resBadRequest(res, "couldn't find any Data")
        return response.resSuccessData(res, Stats);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- sales -----------------------------------------------------//

const getSalesSingleShop = async (req, res) => {
    try {
        let Stats = await AdminFunctions.getSalesSingleShop(req)
        if (!Stats) return response.resBadRequest(res, "couldn't find any Data")
        return response.resSuccessData(res, Stats);
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
    getTopSellers,
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
    getVehiclesByCustomerId,
    terminateCustomer,
    terminateShop,
    deleteOrderByCustomerId,
    updatePassword,
    uplaodAvatar,
    getAllTimeStats,
    getstatsbyMonth,
    getStatsByWeek,
    getSalesSingleShop,
}