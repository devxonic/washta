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
const { getTimeDifferenceFormatted, formateReviewsRatings, formateReviewsRatingsSingle, getDaysInMonth, getDaysInYear, generateDaysOfMonth, generateDaysOfWeek, generateMonthOfYear } = require("../helpers/helper");

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
        { username: req.body.identifier, isTerminated: { $ne: true } },
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



const updateImage = async (req, resizedAvatar, originalAvatar) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { $set: { avatar: originalAvatar.Location, resizedAvatar: resizedAvatar.Location } },
        {
            new: true, fields: {
                avatar: 1,
                resizedAvatar: 1
            }
        }
    );
    return Seller;
};


const editProfile = async (req) => {
    const { name, phone } = req.body;
    let Seller = await SellerModel.findOneAndUpdate(
        { email: req.user.email, isTerminated: { $ne: true } },
        { $set: { name: name, phone: phone } },
        { new: true },
    );
    return Seller;
};

const getProfile = async (req) => {
    let Seller = await SellerModel.findOne(
        { username: req.user.username, isTerminated: { $ne: true } },
        { password: 0, __v: 0 },
    );
    return Seller;
};

const updateNotification = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { $set: { notification: req.body } },
    );
    return Seller;
};

const getNotification = async (req) => {
    let Seller = await SellerModel.findOne(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { password: 0, __v: 0 },
    );
    return Seller.notification;
};
const updatePrivacy = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { $set: { privacy: req.body } },
    );
    return Seller;
};

const getPrivacy = async (req) => {
    let Seller = await SellerModel.findOne(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { password: 0, __v: 0 },
    );
    return Seller.privacy;
};
const updateSecurity = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { $set: { security: req.body } },
    );
    return Seller;
};

const getSecurity = async (req) => {
    let Seller = await SellerModel.findOne(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { password: 0, __v: 0 },
    );
    return Seller.security;
};
const logout = async (req) => {
    let Seller = await SellerModel.findByIdAndUpdate(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { $set: { sessionKey: "" } },
    );
    return Seller;
};

// ----------------------------------------------- Business -----------------------------------------------------//

const addBusiness = async (req) => {
    req.body.status = "pending"
    let date = new Date()
    req.body.cratedAt = date
    let Seller = await SellerModel.findByIdAndUpdate({ _id: req.params.id, isTerminated: { $ne: true } }, { $set: { business: req.body } }, { new: true })
    return Seller
}

// ----------------------------------------------- shops -----------------------------------------------------//

const getAllShop = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } });
    return Shops;
};

const getShopById = async (req) => {
    let Shop = await ShopModel.findOne({ _id: req.params.id, isTerminated: { $ne: true } });
    return Shop;
};

const addShop = async (req) => {
    req.body.Owner = req.user.id
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
    let shopData = await ShopModel.findOne({ _id: id }, { isTimingLocked: 1 })
    console.log(shopData)

    let clone = JSON.stringify(req.body)
    let body = JSON.parse(clone)
    shopData && shopData.isTimingLocked ? delete body['timing'] : null

    if (body?.location && body?.location?.coordinates) {
        body.location = {
            ...body.location,
            type: "Point",
            coordinates: [req.body?.location?.long ?? 0, req.body?.location?.lat ?? 0],
        };
    }
    let Shop = await ShopModel.findOneAndUpdate(
        { _id: id, Owner: req.user.id, isTerminated: { $ne: true } },
        { $set: body },
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
    let Shop = await ShopModel.updateMany({ Owner: req.user.id, isTerminated: { $ne: true }, isTimingLocked: { $ne: true } }, { isOpen: status });
    return Shop;
};

const openShopByid = async (req) => {
    let { id } = req.params
    let { status } = req.body
    let Shop = await ShopModel.findOneAndUpdate({ Owner: req.user.id, _id: id, isTerminated: { $ne: true }, isTimingLocked: { $ne: true } }, { isOpen: status }, { new: true });
    return Shop;
};

// ----------------------------------------------- order -----------------------------------------------------//

const getAllOrders = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let Order = await OrderModel.find({ shopId: { $in: Shops } }).sort({ createdAt: -1, date: -1 })
    console.log(Order);
    return Order;
};

const getOrderById = async (req) => {
    let Order = await OrderModel.findById(req.params.id).sort({ createdAt: -1, date: -1 })
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
    ).populate({ path: 'vehicleId' }).sort({ createdAt: -1, date: -1 })

    return response.resSuccessData(res, Order);
    ;
};

const getorderbyStatus = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let Order = await OrderModel.find({
        $and: [{ shopId: { $in: Shops } }, { status: req.query.status }],
    }).sort({ createdAt: -1, date: -1 })
    return Order;
};

const getpastorder = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let Order = await OrderModel.find({
        $and: [{ shopId: { $in: Shops } }, { $nor: [{ status: "pending" }] }],
    }).populate({ path: "vehicleId" }).sort({ createdAt: -1, date: -1 })
    return Order;
};
const getActiveOrder = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
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
    }).sort({ createdAt: -1, date: -1 })
    return Order;
};
const getLatestOrders = async (req) => {
    let { limit } = req.query
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());

    let Order = await OrderModel.find({
        shopId: { $in: Shops },
        status: { $in: ["ongoing", "inprocess", "completed"] },
    }).limit(limit ?? null).sort({ createdAt: -1, date: -1 })
    return Order;
};

// ----------------------------------------------- Reviews -----------------------------------------------------//


const getMyShopReviews = async (req) => {
    let { shopId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                service: 1,
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
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    if (shopId) {
        if (!Shops.includes(shopId)) return null
        let Reviews = await ReviewModel.find({ shopId, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(limit ?? null).populate(populate)
        if (!Reviews) return Reviews
        let FormatedRating = formateReviewsRatings?.(Reviews)
        return FormatedRating
    }
    let Reviews = await ReviewModel.find({
        $and: { shopId: { $in: Shops }, isDeleted: { $ne: true } },
    }).sort({ createdAt: -1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    return FormatedRating
};

const getSellerReviews = async (req) => {
    let { shopId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                service: 1,
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
        let owner = await shopModel.findOne({ _id: shopId, isTerminated: { $ne: true } }, { Owner: 1 })
        if (!owner) return null
        let Reviews = await ReviewModel.find({ sellerId: owner.Owner, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(limit ?? null).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Reviews)
        return FormatedRating
    }
    let Reviews = await ReviewModel.find({ sellerId: req.user.id, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    return FormatedRating
};



const getOrderReviews = async (req) => {
    let { orderId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                service: 1,
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
    let Reviews = await ReviewModel.find({ orderId, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    return FormatedRating
};


const replyToReview = async (req) => {
    let { reviewId } = req.query
    let { comment, replyTo } = req.body

    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let filter = {
        isDeleted: { $ne: true },
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

    let reply = await ReviewModel.findOneAndUpdate(filter, { $push: { reply: { ...body } } }, { new: true })
    if (!reply) return reply
    let FormatedRating = formateReviewsRatingsSingle?.(reply)
    return FormatedRating
};

const editMyReplys = async (req) => {
    let { reviewId } = req.query
    let { commentId, comment } = req.body

    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());

    let filter = {
        isDeleted: { $ne: true },
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
            return reply
        }
        return reply
    })

    let reply = await ReviewModel.findOneAndUpdate(filter, { reply: myReply }, { new: true, fields: { comment: 1, shopId: 1, reply: 1, rating: 1 } })
    if (!reply) return reply
    let FormatedRating = formateReviewsRatingsSingle?.(reply)
    return FormatedRating
}


const deleteMyReplys = async (req) => {
    let { reviewId, commentId } = req.query
    let Review = await ReviewModel.findOne({ _id: reviewId, isDeleted: { $ne: true } });
    if (!Review) return null
    let myReply = Review.reply.find(reply => {
        if (reply.replyBy.id.toString() == req.user.id && commentId == reply.comment._id.toString()) {
            return reply._id
        }
    })
    if (!myReply) return myReply
    let reply = await ReviewModel.findOneAndUpdate({ _id: Review, isDeleted: { $ne: true } }, { $pull: { reply: { _id: myReply._id } } }, { new: true, fields: { comment: 1, shopId: 1, reply: 1 } })
    return reply
}


const getMyReviews = async (req) => {
    let { id } = req.user
    let populate = [
        { path: "customerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "sellerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "adminId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "ticketId" }
    ]
    let Rating = await ReviewModel.find({ agentId: req.user.id, isDeleted: { $ne: true } }).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Rating)
    return FormatedRating
}

// ----------------------------------------------- Invoice -----------------------------------------------------//

const getAllInvoice = async (req) => {
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let orders = await OrderModel.find({
        $and: [{ shopId: { $in: Shops } }, { status: "completed" }],
    }).populate([
        {
            path: "customerId",
            select: {
                email: 1,
                phone: 1,
                avatar: 1,
                resizedAvatar: 1,
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
    let Shops = await ShopModel.find({ Owner: req.user.id, isTerminated: { $ne: true } }, { _id: 1 });
    Shops = Shops.map((x) => x._id.toString());
    let orders = await OrderModel.findOne({
        $and: [{ shopId: { $in: Shops } }, { status: "completed" }, { _id: id }],
    }).populate([
        {
            path: "customerId",
            select: {
                email: 1,
                phone: 1,
                avatar: 1,
                resizedAvatar: 1,
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





// ----------------------------------------------- stats -----------------------------------------------------//

const getAllTimeStats = async (req) => {
    let { shopId, year } = req.query;
    let newDate = year ? new Date(year) : new Date();
    let totalRevenue = 0;
    let totalNumberOfOrders = 0;
    let totalCompletedOrders = 0;
    let totalCancelledOrders = 0;
    let totalAcceptedOrders = 0;
    let totalPendingOrders = 0;
    let Shops;
    if (!shopId) {
        let shops = await ShopModel.find(
            { Owner: req.user.id, isTerminated: { $ne: true } },
            { _id: 1 }
        );
        Shops = shops.map((x) => x._id.toString());
    }

    const Year = newDate.getFullYear();
    const daysInYear = getDaysInYear(Year);

    let currentMonth;
    let { monthData, monthNames } = generateMonthOfYear();
    let startOfYear = new Date(newDate.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    // End of the year (December 31st)
    let endOfYear = new Date(newDate.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);

    let isShop = shopId ? shopId : { $in: Shops };
    let filter = {
        shopId: isShop,
        $or: [
            {
                creacreatedAt: {
                    $gte: startOfYear,
                    $lt: endOfYear,
                },
            },
            {
                date: {
                    $gte: startOfYear,
                    $lt: endOfYear,
                },
            },
        ],
    };

    let orders = await OrderModel.find(filter);

    for (const singleOrder of orders) {
        // if (singleOrder.billingStatus != "paid") return
        let orderDate = singleOrder.createdAt
            ? new Date(singleOrder.createdAt)
            : new Date(singleOrder.date);
        currentMonth = monthNames[orderDate.getMonth()];
        totalNumberOfOrders++;
        if (singleOrder.status == "completed") {
            monthData[currentMonth].totalOrders++;
            monthData[currentMonth].totalRevenue += parseFloat(singleOrder.cost);
            totalRevenue += parseFloat(singleOrder.cost);
            totalCompletedOrders++;
        }
        if (singleOrder.status == "cancelled") totalCancelledOrders++;
        if (singleOrder.status == "inprocess") totalAcceptedOrders++;
        if (singleOrder.status == "ongoing") totalPendingOrders++;
        monthData[currentMonth].averageDailySales = parseFloat(
            (
                monthData[currentMonth].totalRevenue / daysInYear[orderDate.getMonth()]
            ).toFixed(2)
        );
    }

    let response = {
        totalRevenue,
        averageMonthlySales: parseFloat((totalRevenue / 12).toFixed(2)),
        totalNumberOfOrders,
        totalAcceptedOrders,
        totalPendingOrders,
        totalCancelledOrders,
        graphData: Object.values(monthData),
    };
    return response;
};

const getstatsbyMonth = async (req) => {
    let { startDate, shopId } = req.query;

    let totalNumberOfOrders = 0;
    let totalRevenue = 0;
    let totalCompletedOrders = 0;
    let totalPendingOrders = 0;
    let totalCancelledOrders = 0;
    let totalAcceptedOrders = 0;

    let Shops;
    if (!shopId) {
        let shops = await ShopModel.find(
            { Owner: req.user.id, isTerminated: { $ne: true } },
            { _id: 1 }
        );
        Shops = shops.map((x) => x._id.toString());
    }

    let startOfmonth = startDate ? new Date(startDate) : new Date();
    startOfmonth.setDate(1);
    startOfmonth.setMonth(startOfmonth.getMonth() - 1); // Move to the next month
    startOfmonth.setHours(0, 0, 0, 0);
    let endOfMonth = new Date(startOfmonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    console.log(startOfmonth, endOfMonth);

    let isShop = shopId ? shopId : { $in: Shops };
    let filter = {
        shopId: isShop,
        $or: [
            {
                creacreatedAt: {
                    $gte: startOfmonth,
                    $lt: endOfMonth,
                },
            },
            {
                date: {
                    $gte: startOfmonth,
                    $lt: endOfMonth,
                },
            },
        ],
    };

    let year = startOfmonth.getFullYear();
    let month = startOfmonth.getMonth();
    let monthDays = generateDaysOfMonth(year, month);
    let nameOfdays = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
    ];
    let currentDay;
    console.log(filter);
    console.log(nameOfdays);
    let orders = await OrderModel.find(filter);

    for (const singleOrder of orders) {
        // if (singleOrder.billingStatus != "paid") return
        let orderDate = singleOrder.createdAt
            ? new Date(singleOrder.createdAt)
            : new Date(singleOrder.date);
        currentDay = nameOfdays[orderDate.getDate() - 1];
        totalNumberOfOrders++;
        if (singleOrder.status == "completed") {
            monthDays[currentDay].totalRevenue += parseFloat(singleOrder.cost);
            monthDays[currentDay].totalOrders++;
            totalRevenue += parseFloat(singleOrder.cost);
            totalCompletedOrders++;
        }
        if (singleOrder.status == "cancelled") totalCancelledOrders++;
        if (singleOrder.status == "inprocess") totalAcceptedOrders++;
        if (singleOrder.status == "ongoing") totalPendingOrders++;
    }

    let response = {
        totalNumberOfOrders,
        totalAcceptedOrders,
        totalCompletedOrders,
        totalPendingOrders,
        totalCancelledOrders,
        averageDailySales: parseFloat(
            (totalRevenue / nameOfdays.length).toFixed(2)
        ),
        graphData: Object.values(monthDays),
    };
    return response;
};
const getStatsByWeek = async (req) => {
    let { startDate, shopId } = req.query;

    let totalNumberOfOrders = 0;
    let totalRevenue = 0;
    let totalCompletedOrders = 0;
    let totalPendingOrders = 0;
    let totalCancelledOrders = 0;
    let totalAcceptedOrders = 0;
    let Shops;
    if (!shopId) {
        let shops = await ShopModel.find(
            { Owner: req.user.id, isTerminated: { $ne: true } },
            { _id: 1 }
        );
        Shops = shops.map((x) => x._id.toString());
    }

    let startOfWeek = startDate ? new Date(startDate) : new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    let endOfMonth = new Date(startOfWeek);
    endOfMonth.setDate(startOfWeek.getDate() + 7);
    endOfMonth.setHours(0, 0, 0, 0);

    let isShop = shopId ? shopId : { $in: Shops };
    let filter = {
        shopId: isShop,
        $or: [
            {
                creacreatedAt: {
                    $gte: startOfWeek,
                    $lt: endOfMonth,
                },
            },
            {
                date: {
                    $gte: startOfWeek,
                    $lt: endOfMonth,
                },
            },
        ],
    };

    let { weekData, daysOfWeek } = generateDaysOfWeek();
    let currentDay;
    console.log(filter);
    console.log(weekData, daysOfWeek);
    let orders = await OrderModel.find(filter);

    for (const singleOrder of orders) {
        // if (singleOrder.billingStatus != "paid") return
        let orderDate = singleOrder.createdAt
            ? new Date(singleOrder.createdAt)
            : new Date(singleOrder.date);
        currentDay = daysOfWeek[orderDate.getDay()];
        totalNumberOfOrders++;
        if (singleOrder.status == "completed") {
            weekData[currentDay].totalRevenue += parseFloat(singleOrder.cost);
            weekData[currentDay].totalOrders++;
            totalRevenue += parseFloat(singleOrder.cost);
            totalCompletedOrders++;
        }
        if (singleOrder.status == "cancelled") totalCancelledOrders++;
        if (singleOrder.status == "inprocess") totalAcceptedOrders++;
        if (singleOrder.status == "ongoing") totalPendingOrders++;
    }

    let response = {
        totalNumberOfOrders,
        totalAcceptedOrders,
        totalPendingOrders,
        totalCancelledOrders,
        totalCompletedOrders,
        averageDailySales: parseFloat((totalRevenue / 7).toFixed(2)),
        graphData: Object.values(weekData),
    };
    return response;
};

// ----------------------------------------------- agent Reviews -----------------------------------------------------//


const createAgentReview = async (req) => {
    let { agentId, ticketId, rating, comment } = req.body
    let { id } = req.user

    let Rating = await ReviewModel({ agentId, ticketId, sellerId: id, rating, 'comment.text': comment.text }).save()
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}



const updatesAgentReview = async (req) => {
    let { rating, comment } = req.body
    let { reviewId } = req.query

    let Rating = await ReviewModel.findOneAndUpdate({ _id: reviewId, sellerId: req.user.id, isDeleted: { $ne: true } }, { rating, 'comment.text': comment.text }, { new: true, fields: { rating: 1, comment: 1 } })
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}


const getAgentReview = async (req) => {
    let { agentId, limit } = req.query

    let populate = [
        { path: "sellerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "agentId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } }, ,
        { path: "ticketId" }
    ]

    if (!agentId) return { error: "agent Id Must be required" }
    let Reviews = await ReviewModel.find({ agentId, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    return FormatedRating
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
    getLatestOrders,
    getorderbyStatus,
    getpastorder,
    getActiveOrder,
    getMyShopReviews,
    replyToReview,
    deleteMyReplys,
    editMyReplys,
    getAllInvoice,
    getAllInvoiceById,
    getSellerReviews,
    getOrderReviews,
    openAllShops,
    openShopByid,
    updateImage,
    getAllTimeStats,
    getstatsbyMonth,
    getStatsByWeek,
    createAgentReview,
    updatesAgentReview,
    getAgentReview,
};
