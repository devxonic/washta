
const SellerFunctions = require('../functions/Seller');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SellerModel = require('../models/seller');
require('dotenv').config()


const getProfile = async (req, res) => {
    try {
        let Seller = await SellerFunctions.getProfile(req);
        return response.resSuccessData(res, Seller);
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}
const editProfile = async (req, res) => {
    try {
        let Seller = await SellerFunctions.editProfile(req);
        return response.resSuccessData(res, "updated");
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}



const updatePassword = async (req, res) => {
    try {
        let { newPassword, previousPassword } = req.body
        let getSeller = await SellerModel.findOne({ _id: req.user.id }, { password: 1 })
        if (!getSeller) return response.resBadRequest(res, "User Not Found")
        let match = await validationFunctions.verifyPassword(previousPassword, getSeller.password)
        console.log("match ----------", match)
        if (!match) return response.resBadRequest(res, "incorrect Previous Password");
        let hash = await bcrypt.hash(newPassword, 10);
        // return response.resSuccess(res, User);
        let Seller = await SellerModel.findOneAndUpdate({ _id: req.user.id }, { $set: { password: hash } }, {
            new: true, fields: {
                username: 1,
                email: 1,
                phone: 1
            }
        })

        return response.resSuccessData(res, Seller);
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}

// ----------------------------------------------- Seller settings -----------------------------------------------------//

const updateNotificationSetting = async (req, res) => {
    try {

        let notification = await SellerFunctions.updateNotification(req)
        return response.resSuccessData(res, "updated");

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}

const getNotificationSetting = async (req, res) => {
    try {

        let notification = await SellerFunctions.getNotification(req)
        return response.resSuccessData(res, notification);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}


const updatePrivacySetting = async (req, res) => {
    try {

        let privacy = await SellerFunctions.updatePrivacy(req)
        return response.resSuccessData(res, "updated");

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}

const getPrivacySetting = async (req, res) => {
    try {

        let privacy = await SellerFunctions.getPrivacy(req)
        return response.resSuccessData(res, privacy);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}


const updateSecuritySetting = async (req, res) => {
    try {

        let security = await SellerFunctions.updateSecurity(req)
        return response.resSuccessData(res, "updated");

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }

}

const getSecuritySetting = async (req, res) => {
    try {

        let security = await SellerFunctions.getSecurity(req)
        return response.resSuccessData(res, security);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}



// ----------------------------------------------- Business -----------------------------------------------------//

const addBusiness = async (req, res) => {
    try {
        let Seller = await SellerFunctions.addBusiness(req)
        if (!Seller) return response.resBadRequest(res, "couldn't find user")
        if (Seller._doc.business) {
            return response.resSuccessData(res, {
                id: Seller._doc._id,
                message: "Your busniess going to pending State , wait for Admin Approval"
            })
        }
        return response.resBadRequest(res, Seller._doc.business);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getBusiness = async (req, res) => {
    try {
        let Seller = await SellerFunctions.getSellerByToken(req)
        if (!Seller) return response.resBadRequest(res, "couldn't find user")
        return response.resSuccessData(res, Seller.business);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const updateBusiness = async (req, res) => {
    try {
        let Seller = await SellerFunctions.addBusiness(req)
        if (!Seller) return response.resBadRequest(res, "couldn't find user")
        return response.resSuccessData(res, Seller.business);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

// ----------------------------------------------- Shop -----------------------------------------------------//


const getAllShop = async (req, res) => {
    try {
        let Shops = await SellerFunctions.getAllShop(req)
        if (!Shops) return response.resBadRequest(res, "couldn't find any Shops")
        return response.resSuccessData(res, Shops);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getShopById = async (req, res) => {
    try {
        let Shop = await SellerFunctions.getShopById(req)
        if (!Shop) return response.resBadRequest(res, "couldn't find Shops on this ID")
        return response.resSuccessData(res, Shop);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const addShop = async (req, res) => {
    try {
        let Shop = await SellerFunctions.addShop(req)
        if (!Shop) return response.resBadRequest(res, "couldn't find user")
        return response.resSuccessData(res, Shop);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}
const updateShop = async (req, res) => {
    try {
        let Shop = await SellerFunctions.updateShop(req)
        if (!Shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, Shop);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}
const deleteShop = async (req, res) => {
    try {
        let shop = await SellerFunctions.deleteShop(req)
        if (!shop) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, shop);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}



// ----------------------------------------------- Shop -----------------------------------------------------//

const getAllOrders = async (req, res) => {
    try {
        let Orders = await SellerFunctions.getAllOrders(req)
        if (!Orders) return response.resBadRequest(res, "couldn't find any Order")
        return response.resSuccessData(res, Orders);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const getOrderById = async (req, res) => {
    try {
        let Order = await SellerFunctions.getOrderById(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Order on this ID")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const orderStatus = async (req, res) => {
    try {
        let Order = await SellerFunctions.orderStatus(req, res)
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getorderbyStatus = async (req, res) => {
    try {
        let Order = await SellerFunctions.getorderbyStatus(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Order")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getpastorder = async (req, res) => {
    try {
        let Order = await SellerFunctions.getpastorder(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Order")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getActiveOrder = async (req, res) => {
    try {
        let Order = await SellerFunctions.getActiveOrder(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Order")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

// ----------------------------------------------- Reviews -----------------------------------------------------//


const getMyShopReviews = async (req, res) => {
    try {
        let Order = await SellerFunctions.getMyShopReviews(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}
// ----------------------------------------------- invoice -----------------------------------------------------//


const getAllInvoice = async (req, res) => {
    try {
        let Order = await SellerFunctions.getAllInvoice(req)
        if (!Order) return response.resBadRequest(res, "couldn't find invoice")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getAllInvoiceById = async (req, res) => {
    try {
        let Order = await SellerFunctions.getAllInvoiceById(req)
        if (!Order) return response.resBadRequest(res, "couldn't find invoice")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

// ----------------------------------------------- invoice -----------------------------------------------------//


const getAllMyNotifications = async (req, res) => {
    try {
        let Notifications = await SellerFunctions.getAllMyNotifications(req)
        if (!Notifications) return response.resBadRequest(res, "couldn't find Notifications")
        return response.resSuccessData(res, Notifications);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const editMyReplys = async (req, res) => {
    try {
        let Order = await SellerFunctions.editMyReplys(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


const replyToReview = async (req, res) => {
    try {
        let Order = await SellerFunctions.replyToReview(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getSellerReviews = async (req, res) => {
    try {
        let Order = await SellerFunctions.getSellerReviews(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const getOrderReviews = async (req, res) => {
    try {
        let Order = await SellerFunctions.getOrderReviews(req)
        if (!Order) return response.resBadRequest(res, "couldn't find Shop")
        return response.resSuccessData(res, Order);
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
    addBusiness,
    getBusiness,
    updateBusiness,
    getAllShop,
    getShopById,
    addShop,
    updateShop,
    deleteShop,
    getAllOrders,
    getOrderById,
    orderStatus,
    getorderbyStatus,
    getpastorder,
    getActiveOrder,
    getMyShopReviews,
    replyToReview,
    editMyReplys,
    getAllInvoice,
    getAllInvoiceById,
    getAllMyNotifications,
    getSellerReviews,
    getOrderReviews,
    updatePassword
}