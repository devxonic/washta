
const CustomerFunctions = require('../functions/Customer');
const response = require('../helpers/response');
const authFunctions = require('../functions/auth');

const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CustomerModel = require('../models/Customer');
const { s3UploadObject } = require('../middlewares');
const sharp = require('sharp');
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


const updatePassword = async (req, res) => {
    try {
        let { newPassword, previousPassword } = req.body
        let getCustomer = await CustomerModel.findOne({ _id: req.user.id }, { password: 1 })
        if (!getCustomer) return response.resBadRequest(res, "User Not Found")
        let match = await validationFunctions.verifyPassword(previousPassword, getCustomer.password)
        console.log("match ----------", match)
        if (!match) return response.resBadRequest(res, "incorrect Previous Password");
        let hash = await bcrypt.hash(newPassword, 10);
        // return response.resSuccess(res, User);
        let Customer = await CustomerModel.findOneAndUpdate({ _id: req.user.id }, { $set: { password: hash } }, {
            new: true, fields: {
                username: 1,
                email: 1,
                phone: 1
            }
        })

        return response.resSuccessData(res, Customer);
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
            let updateImage = await CustomerFunctions.updateImage(req, resizedImage, originalImage);
            console.log('file received', updateImage);
            return response.resSuccessData(res, updateImage);
        }

    } catch (error) {
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

const getShopByLocation = async (req, res) => {
    try {
        let Shop = await CustomerFunctions.getShopByLocation(req)
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

const getShopsServicefee = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getShopsServicefee(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getShopsPromoCode = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getShopsPromoCode(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Promo Code")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const cancelBooking = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.cancelBooking(req)
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


// ----------------------------------------------- Booking -----------------------------------------------------//

const getbookingbyStatus = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getbookingbyStatus(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

// ----------------------------------------------- Ratings -----------------------------------------------------//

const createShopRating = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.createShopRating(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getMyReviews = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getMyReviews(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Review")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getShopReviews = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getShopReviews(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Review")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const deleteShopReviews = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.deleteShopReviews(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Review")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updatesShopReview = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.updatesShopReview(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Review")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const createSellerReview = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.createSellerReview(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Review")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const getSellerReview = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getSellerReview(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Review")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updatesSellerReview = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.updatesSellerReview(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Review")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

// ----------------------------------------------- Booking -----------------------------------------------------//

const getAllInvoice = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getAllInvoice(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find Booking")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getInvoiceById = async (req, res) => {
    try {
        let Booking = await CustomerFunctions.getInvoiceById(req)
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
    getShopByLocation,
    getMyBookings,
    getMyBookingById,
    createNewBooking,
    getbookingbyStatus,
    getShopsServicefee,
    getShopsPromoCode,
    createShopRating,
    getMyReviews,
    updatesShopReview,
    getAllInvoice,
    getInvoiceById,
    cancelBooking,
    getShopReviews,
    createSellerReview,
    getSellerReview,
    updatesSellerReview,
    deleteShopReviews,
    updatePassword,
    uplaodAvatar,
}