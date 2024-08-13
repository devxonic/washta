const SellerModel = require("../models/seller");
const customerModel = require("../models/Customer");
const ShopModel = require("../models/shop");
const adminModel = require("../models/admin");
const OrderModel = require("../models/Order");
const notificationModel = require("../models/notification");
const bcrypt = require("bcrypt");
const response = require("../helpers/response");
const { default: mongoose } = require("mongoose");
const ReviewModel = require("../models/Review");
const { getTimeDifferenceFormatted } = require("../helpers/helper");
const shopModel = require("../models/shop");

const signUp = async (req) => {
    let newSeller = new SellerModel(req.body);
    let hash = await bcrypt.hash(req.body.password, 10);
    newSeller.password = hash;
    let result = await newSeller.save();
    return result;
};

const getSeller = async (req) => {
    let Seller = await SellerModel.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    return Seller;
};

const getSellerByToken = async (req) => {
    let Seller = await SellerModel.findOne({
        $or: [{ username: req.user.username }, { email: req.user.email }],
    });

    return Seller;
};
const findSeller = async (req) => {
    let Seller = await SellerModel.findById(req.user.id);
    console.log("asdasdas", req.user.id, Seller);
    return Seller;
};

const updateRefreshToken = async (req, token) => {
    let Seller = await SellerModel.findOneAndUpdate(
        { username: req.body.identifier },
        { $set: { sessionKey: token } },
    );
    return Seller;
};

const signUpWithGoogle = async (req) => {
    let Seller = await SellerModel.findOne({ email: req.body.identifier });
    console.log(Seller);
    if (Seller) {
        console.log("google user found");
        if (Seller.googleId === req.body.googleUser.id) return Seller;
        throw new Error("incorrect details provided");
    }
    console.log("creating a new google user");
    req.body.googleId = req.body.googleUser.id;
    req.body.email = req.body.identifier;
    let newSeller = new SellerModel(req.body);
    let result = await newSeller.save();
    return result;
};

const editProfile = async (req) => {
    const { name, phone } = req.body;
    let Seller = await SellerModel.findOneAndUpdate(
        { email: req.user.email },
        { $set: { name: name, phone: phone } },
        { new: true },
    );
    return Seller;
};

const getProfile = async (req) => {
    let Seller = await SellerModel.findOne(
        { username: req.user.username },
        { password: 0, __v: 0 },
    );
    return Seller;
};

const updateNotification = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { notification: req.body } },
    );
    return Seller;
};

const getNotification = async (req) => {
    let Seller = await SellerModel.findOne(
        { _id: req.user.id },
        { password: 0, __v: 0 },
    );
    return Seller.notification;
};
const updatePrivacy = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { privacy: req.body } },
    );
    return Seller;
};

const getPrivacy = async (req) => {
    let Seller = await SellerModel.findOne(
        { _id: req.user.id },
        { password: 0, __v: 0 },
    );
    return Seller.privacy;
};
const updateSecurity = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { security: req.body } },
    );
    return Seller;
};

const getSecurity = async (req) => {
    let Seller = await SellerModel.findOne(
        { _id: req.user.id },
        { password: 0, __v: 0 },
    );
    return Seller.security;
};
const logout = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { sessionKey: "" } },
    );
    return Seller;
};

// ----------------------------------------------- Business -----------------------------------------------------//

const addBusiness = async (req) => {
    req.body.status = "pending"
    let date = new Date()
    req.body.cratedAt = date
    let Seller = await SellerModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { business: req.body } }, { new: true })
    return Seller
}

// ----------------------------------------------- shops -----------------------------------------------------//

const getAllShop = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id });
    return Shops;
};

const getShopById = async (req) => {
    let Shop = await ShopModel.findById(req.params.id);
    return Shop;
};

const addShop = async (req) => {
    req.body.location = {
        ...req.body.location,
        type: "Point",
        coordinates: [req.body?.location?.long ?? 0, req.body?.location?.lat ?? 0],
    };
    let Shop = await ShopModel({ ...req.body }).save();
    return Shop;
};

const updateShop = async (req) => {
    let id = req.params.id;
    let Shop = await ShopModel.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true },
    );
    return Shop;
};

const deleteShop = async (req) => {
    let Shop = await ShopModel.findOneAndDelete({ _id: req.params.id, Owner: req.user.id });
    return Shop;
};

const openAllShops = async (req) => {
    let { status } = req.body
    let Shop = await ShopModel.updateMany({ Owner: req.user.id }, { isOpen: status });
    return Shop;
};

const openShopByid = async (req) => {
    let { id } = req.params
    let { status } = req.body
    let Shop = await ShopModel.findOneAndUpdate({ Owner: req.user.id, _id: id }, { isOpen: status }, { new: true });
    return Shop;
};

// ----------------------------------------------- order -----------------------------------------------------//

const getAllOrders = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let Order = await OrderModel.find({ shopId: { $in: Shops } });
    console.log(Order);
    return Order;
};

const getOrderById = async (req) => {
    let Order = await OrderModel.findById(req.params.id);
    return Order;
};

const orderStatus = async (req, res) => {
    let id = req.params.id;
    let { status } = req.body;
    let date = new Date();
    let checkOrder = await OrderModel.findOne({ _id: id }, {
        isCompleted: 1,
        isAccepted: 1,
        isCancel: 1,
    })
    if (checkOrder?.isCompleted && checkOrder.isCompleted) return response.resBadRequest(res, "This order has already been completed. You can't change its status");
    let OBJ = { status }
    if (status == "inprocess") OBJ = { ...OBJ, orderAcceptedAt: date, isAccepted: true }
    if (status == "cancelled") OBJ = { ...OBJ, cancelBy: "seller", cancellationTime: date, isCancel: true, }
    if (status == "completed") OBJ = { ...OBJ, orderCompleteAt: date, isCompleted: true }
    let Order = await OrderModel.findOneAndUpdate(
        { _id: id },
        { $set: OBJ },
        { new: true },
    ).populate({ path: 'vehicleId' })

    return response.resSuccessData(res, Order);
    ;
};

const getorderbyStatus = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let Order = await OrderModel.find({
        $and: [{ shopId: { $in: Shops } }, { status: req.query.status }],
    });
    return Order;
};

const getpastorder = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let Order = await OrderModel.find({
        $and: [{ shopId: { $in: Shops } }, { $nor: [{ status: "pending" }] }],
    }).populate({ path: "vehicleId" });
    return Order;
};
const getActiveOrder = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let newDate = new Date()
    newDate.setHours(0, 0, 0, 0);
    let endOfDay = new Date(newDate);
    endOfDay.setHours(23, 59, 59, 999);
    let Order = await OrderModel.find({
        shopId: { $in: Shops },
        status: "ongoing",
        date: {
            $gte: newDate,
            $lt: endOfDay,
        }
    });
    return Order;
};

// ----------------------------------------------- Reviews -----------------------------------------------------//


const getMyShopReviews = async (req) => {
    let { shopId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                shopDetails: 1,
                estimatedServiceTime: 1,
                cost: 1,
            }
        },
        {
            path: "orderId", select: {
                customerId: 0,
                vehicleId: 0,
                shopId: 0,
                location: 0,
            }
        }
    ]
    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    if (shopId) {
        if (!Shops.includes(shopId)) return null
        let Reviews = await ReviewModel.find({ shopId }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Reviews)
        return FormatedRating
    }
    let Reviews = await ReviewModel.find({
        $and: { shopId: { $in: Shops } },
    }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    return FormatedRating
};

const getSellerReviews = async (req) => {
    let { shopId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                shopDetails: 1,
                estimatedServiceTime: 1,
                cost: 1,
            }
        },
        {
            path: "orderId", select: {
                customerId: 0,
                vehicleId: 0,
                shopId: 0,
                location: 0,
            }
        }
    ]
    if (shopId) {
        let owner = await shopModel.findOne({ _id: shopId }, { Owner: 1 })
        if (!owner) return null
        let Reviews = await ReviewModel.find({ sellerId: owner.Owner }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Reviews)
        return FormatedRating
    }
    let Reviews = await ReviewModel.find({ sellerId: req.user.id }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    return FormatedRating
};



const getOrderReviews = async (req) => {
    let { orderId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                shopDetails: 1,
                estimatedServiceTime: 1,
                cost: 1,
            }
        },
        {
            path: "orderId", select: {
                customerId: 0,
                vehicleId: 0,
                shopId: 0,
                location: 0,
            }
        }
    ]
    let Reviews = await ReviewModel.find({ orderId }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    return FormatedRating
};


const replyToReview = async (req) => {
    let { reviewId } = req.query
    let { comment, replyTo } = req.body

    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let filter = {
        $or: [
            {
                $and: [
                    { shopId: { $in: Shops } },
                    { _id: reviewId }
                ]
            },
            {
                $and: [
                    { sellerId: req.user.id },
                    { _id: reviewId }
                ]
            }
        ]
    }

    let Review = await ReviewModel.findOne(filter);
    if (!Review) return null
    let body = {
        replyTo,
        replyBy: {
            id: req.user.id,
            role: 'seller'
        },
        comment
    }
    console.log(Review)

    let reply = ReviewModel.findOneAndUpdate(filter, { $push: { reply: { ...body } } }, { new: true })
    let FormatedRating = formateReviewsRatings?.(reply)
    return FormatedRating
};

const editMyReplys = async (req) => {
    let { reviewId } = req.query
    let { commentId, comment } = req.body

    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());

    let filter = {
        $or: [
            {
                $and: [
                    { shopId: { $in: Shops } },
                    { _id: reviewId }
                ]
            },
            {
                $and: [
                    { sellerId: req.user.id },
                    { _id: reviewId }
                ]
            }
        ]
    }

    let Review = await ReviewModel.findOne(filter);
    if (!Review) return null
    let myReply = Review.reply.map(reply => {
        if (reply.replyBy.id.toString() == req.user.id && commentId == reply.comment._id.toString()) {
            reply.comment.text = comment.text
            let FormatedRating = formateReviewsRatings?.(reply)
            return FormatedRating
        }
        let FormatedRating = formateReviewsRatings?.(reply)
        return FormatedRating
    })

    let reply = ReviewModel.findOneAndUpdate(filter, { reply: myReply }, { new: true, fields: { comment: 1, shopId: 1, reply: 1 } })
    let FormatedRating = formateReviewsRatings?.(reply)
    return FormatedRating
}
// ----------------------------------------------- Invoice -----------------------------------------------------//

const getAllInvoice = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let orders = await OrderModel.find({
        $and: [{ shopId: { $in: Shops } }, { status: "completed" }],
    }).populate([
        {
            path: "customerId",
            select: {
                email: 1,
                phone: 1,
                profile: 1,
                username: 1,
                fullName: 1,
                selectedVehicle: 1,
            }
        },
        {
            path: "vehicleId",
            select: {
                vehicleManufacturer: 1,
                vehiclePlateNumber: 1,
                vehicleName: 1,
                vehicleType: 1,
            }
        }]);

    let updatedOrder = orders.map(order => {
        if (order._doc.orderCompleteAt && order._doc.orderAcceptedAt) {
            return order._doc = {
                ...order._doc, duration: getTimeDifferenceFormatted(order._doc.orderAcceptedAt, order._doc.orderCompleteAt)
            }
        }
        return order._doc

    })
    return updatedOrder;
};


const getAllInvoiceById = async (req) => {
    let { id } = req.params
    let Shops = await ShopModel.find({ Owner: req.user.id }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let orders = await OrderModel.findOne({
        $and: [{ shopId: { $in: Shops } }, { status: "completed" }, { _id: id }],
    }).populate([
        {
            path: "customerId",
            select: {
                email: 1,
                phone: 1,
                profile: 1,
                username: 1,
                fullName: 1,
                selectedVehicle: 1,
            }
        },
        {
            path: "vehicleId",
            select: {
                vehicleManufacturer: 1,
                vehiclePlateNumber: 1,
                vehicleName: 1,
                vehicleType: 1,
            }
        }]);
    if (orders._doc?.orderAcceptedAt && orders._doc?.orderCompleteAt) {
        orders._doc = { ...orders._doc, duration: getTimeDifferenceFormatted(orders._doc.orderAcceptedAt, orders._doc.orderCompleteAt) }
    }
    return orders._doc;
};


// ----------------------------------------------- Notification -----------------------------------------------------//


const getAllMyNotifications = async (req) => {
    let { id } = req.params
    let body = {}
    let Notifications = await notificationModel.find({ 'receiver.id': req.user.id })
    let UpdatedNotification = []
    for (let i = 0; i < Notifications.length; i++) {
        UpdatedNotification[i] = Notifications[i]
        if (Notifications[i].sender.role == "customer") {
            let customer = await customerModel.findOne({ _id: Notifications[i].sender.id }, { username: 1, profile: 1 })
            UpdatedNotification[i].sender = {
                ...Notifications[i].sender,
                profile: customer?.profile ?? null,
                username: customer?.username ?? null
            }
        }
        if (Notifications[i].sender.role == "seller") {
            let seller = await SellerModel.findOne({ _id: Notifications[i].sender.id }, { username: 1, profile: 1 })
            UpdatedNotification[i].sender = {
                ...Notifications[i].sender,
                profile: seller?.profile,
                username: seller?.username
            }
        }
        if (Notifications[i].sender.role == "admin") {
            let seller = await adminModel.findOne({ _id: Notifications[i].sender.id }, { username: 1, profile: 1 })
            UpdatedNotification[i].sender = {
                ...Notifications[i].sender,
                profile: seller?.profile,
                username: seller?.username
            }
        }
        // if (Notifications[i].sender.role == "agent") {
        //     let seller = await adminModel.findOne({ _id: Notifications[i].sender.id }, { username: 1, profile: 1 })
        //     UpdatedNotification[i].sender = {
        //         ...Notifications[i].sender,
        //         profile: seller?.profile,
        //         username: seller?.username
        //     }
        // }

    }
    return UpdatedNotification;
};

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
    addBusiness,
    getSellerByToken,
    getAllShop,
    getShopById,
    addShop,
    deleteShop,
    updateShop,
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
    openAllShops,
    openShopByid,
};
