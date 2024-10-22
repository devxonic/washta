const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
const shopModel = require('../models/shop');
const ReviewModel = require('../models/Review');
const OrderModel = require('../models/Order');
const serviceModel = require('../models/servicefee');
const PromoCodeModel = require('../models/PromoCode');
const { getTimeDifferenceFormatted, formateReviewsRatings, formateReviewsRatingsSingle, getRatingStatistics } = require('../helpers/helper');
const { NotificationOnBooking, NotificationOnReview } = require('../helpers/notification');
const ServiceModel = require('../models/servicefee');
const stripe = require("stripe")(process.env.stripe_secret);

const signUp = async (req) => {
    let newCustomer = new CustomerModel(req.body);
    let hash = await bcrypt.hash(req.body.password, 10);
    newCustomer.password = hash;
    let result = await newCustomer.save();
    return result;
}


const getSeller = async (req) => {

    let Customer = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    return Customer;
}
const findSeller = async (req) => {
    let player = await CustomerModel.findById(req.user.id);
    console.log("asdasdas", req.user.id, player)
    return player;
}

const updateRefreshToken = async (req, token) => {
    let player = await CustomerModel.findOneAndUpdate({ username: req.body.identifier, isTerminated: { $ne: true } }, { $set: { sessionKey: token } })
    return player
}


const signUpWithGoogle = async (req) => {
    let player = await CustomerModel.findOne({ email: req.body.identifier })
    console.log(player)
    if (player) {
        console.log('google user found')
        if (player.googleId === req.body.googleUser.id) return player
        throw new Error("incorrect details provided")
    }
    console.log('creating a new google user')
    req.body.googleId = req.body.googleUser.id
    req.body.email = req.body.identifier
    let newPlayer = new CustomerModel(req.body);
    let result = await newPlayer.save();
    return result;

}

const editProfile = async (req) => {

    let Customer = await CustomerModel.findOneAndUpdate({ email: req.user.email, isTerminated: { $ne: true } },
        { $set: { fullname: req.bodyfullName, phone: req.bodyphone } }, {
        new: true, fields: {
            notification: 0,
            privacy: 0,
            security: 0
        }
    });
    let car = await VehiclesModel.findOneAndUpdate({ _id: req.body.car._id },
        { $set: { ...req.body.car } }, {
        new: true
    })

    return { Customer: Customer, car };
}

const getProfile = async (req) => {
    let Customer = await CustomerModel.findOne({ username: req.user.username, isTerminated: { $ne: true } }, {
        password: 0, __v: 0, notification: 0,
        privacy: 0,
        security: 0,
    });
    let car = await VehiclesModel.findOne({ $and: [{ Owner: Customer._id }, { isSelected: true }] }, { __v: 0 });
    return { Customer, car };
}


const updateImage = async (req, resizedAvatar, originalAvatar) => {
    let customer = await CustomerModel.findByIdAndUpdate(
        { _id: req.user.id, isTerminated: { $ne: true } },
        { $set: { avatar: originalAvatar.Location, resizedAvatar: resizedAvatar.Location } },
        {
            new: true, fields: {
                avatar: 1,
                resizedAvatar: 1
            }
        }
    );
    return customer;
};

const updateNotification = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id, isTerminated: { $ne: true } }, { $set: { notification: req.body } })
    return player
}

const getNotification = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id, isTerminated: { $ne: true } }, { password: 0, __v: 0 });
    return player.notification;
}
const updatePrivacy = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id, isTerminated: { $ne: true } }, { $set: { privacy: req.body } })
    return player
}

const getPrivacy = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id, isTerminated: { $ne: true } }, { password: 0, __v: 0 });
    return player.privacy;
}
const updateSecurity = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id, isTerminated: { $ne: true } }, { $set: { security: req.body } })
    return player
}

const getSecurity = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id, isTerminated: { $ne: true } }, { password: 0, __v: 0 });
    return player.security;
}
const logout = async (req) => {
    console.log(req.user)
    if (req.user.role == "customer") {
        let User = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { sessionKey: '' } })
        return User
    }
    if (req.user.role == "seller") {
        let User = await SellerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { sessionKey: '' } })
        return User
    }
}


const getVehicles = async (req) => {
    let Vehicles = await VehiclesModel.find({ Owner: req.user.id });
    return Vehicles;
}

const addVehicles = async (req) => {
    let { vehicleManufacturer, vehiclePlateNumber, vehicleName, vehicleType } = req.body
    let newVehicle = VehiclesModel({
        Owner: req.user.id,
        vehicleManufacturer,
        vehiclePlateNumber,
        vehicleName,
        vehicleType
    })
    let Vehicle = await newVehicle.save();
    return Vehicle
}

const updateVehicles = async (req) => {
    let { id } = req.params
    let vehicle = await VehiclesModel.findOneAndUpdate({ $and: [{ Owner: req.user.id }, { _id: id }] }, { ...req.body }, { new: true })
    return vehicle
}

const deleteVehicle = async (req) => {
    let { id } = req.params
    let vehicle = await VehiclesModel.findByIdAndDelete({ _id: id, Owner: req.user.id })
    return vehicle
}

const getIsSelected = async (req) => {
    let Vehicles = await VehiclesModel.findOne({ $and: [{ Owner: req.user.id }, { isSelected: true }] });
    return Vehicles;
}

const updateIsSelected = async (req) => {
    let id = req.body.id
    let Vehicles = await VehiclesModel.findOneAndUpdate({ $and: [{ Owner: req.user.id }, { isSelected: true }] }, { isSelected: false });
    let Selected = await VehiclesModel.findOneAndUpdate({ $and: [{ Owner: req.user.id }, { _id: id }] }, { isSelected: true }, { new: true });
    return Selected;
}


// ----------------------------------------------- shop -----------------------------------------------------//


const getAllShops = async (req) => {
    let Shops = await shopModel.find({ isTerminated: { $ne: true }, isOpen: true, })
    let updatedShops = [];
    for (const shop of Shops) {
        let shopReviews = await ReviewModel.find({ shopId: shop?._id, isDeleted: { $ne: true } })
        let shopOrders = await OrderModel.find({ shopId: shop?._id, status: "completed" }).count();
        let formatedReviews = formateReviewsRatings(shopReviews);
        let stats = getRatingStatistics(formatedReviews);
        let temp = {
            ...shop?._doc,
            reviewsSummary: {
                averageRating: stats.averageRating || 0,
                totalReviews: stats.totalReviews || 0,
                recommendationPercentage: stats.recommendationPercentage || 0,
            },
            totalNoOfJobs: shopOrders || 0
        }
        updatedShops.push(temp)
    }
    return updatedShops
}

const getShopById = async (req) => {
    let Shops = await shopModel.findOne({ _id: req.params.id, isTerminated: { $ne: true }, })
    let shopReviews = await ReviewModel.find({ shopId: Shops?._id, isDeleted: { $ne: true } })
    let shopOrders = await OrderModel.find({ shopId: Shops?._id, status: "completed" }).count();
    let formatedReviews = formateReviewsRatings(shopReviews);
    let stats = getRatingStatistics(formatedReviews);
    let updatedShops = {
        ...Shops?._doc,
        reviewsSummary: {
            averageRating: stats.averageRating || 0,
            totalReviews: stats.totalReviews || 0,
            recommendationPercentage: stats.recommendationPercentage || 0,
        },
        totalNoOfJobs: shopOrders || 0
    }
    return updatedShops

}


function haversineDistance(coords1, coords2) {
    const toRad = (x) => (x * Math.PI) / 180;

    const lat1 = coords1[1];
    const lon1 = coords1[0];
    const lat2 = coords2[1];
    const lon2 = coords2[0];

    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000; // distance in meters
}


const getShopByLocation = async (req) => {
    console.log('req.body.radius', req.query.radius, req.query.lat, req.query.long);
    let Shops = await shopModel.find({
        isTerminated: { $ne: true },
        isOpen: true,
        location: {
            $nearSphere:
            {
                $geometry: {
                    type: "Point",
                    coordinates: [req.query.long, req.query.lat]
                },
                $minDistance: 0,
                $maxDistance: parseFloat(req.query.radius ? req.query.radius : 1000)
            }
        }
    })
    const userCoordinates = [req.query.long, req.query.lat];
    let shopsWithDistance = []
    for (const shop of Shops) {
        let shopReviews = await ReviewModel.find({ shopId: shop?._id, isDeleted: { $ne: true } })
        let shopOrders = await OrderModel.find({ shopId: shop?._id, status: "completed" }).count();

        let formatedReviews = formateReviewsRatings(shopReviews);
        let stats = getRatingStatistics(formatedReviews);

        const distance = haversineDistance(userCoordinates, shop.location.coordinates);
        shopsWithDistance = {
            ...shop.toObject(),
            distanceInMeter: parseFloat(distance.toFixed(1)),
            distanceInKiloMeter: parseFloat((distance / 1000).toFixed(1)),
            reviewsSummary: {
                averageRating: stats.averageRating || 0,
                totalReviews: stats.totalReviews || 0,
                recommendationPercentage: stats.recommendationPercentage || 0,
            },
            totalNoOfJobs: shopOrders || 0

        };


    }
    return shopsWithDistance
}

// ----------------------------------------------- Bookings -----------------------------------------------------//

const getMyBookings = async (req) => {
    let Bookings = await OrderModel.find({ customerId: req.user.id })
    return Bookings
}

const getShopsServicefee = async (req) => {
    let id = req.params.id
    let ServiceFee = await serviceModel.find({ applyAt: id, ApplicableStatus: { $ne: false } })
    return ServiceFee
}

const getShopsPromoCode = async (req) => {
    let id = req.user.id
    let { promoCode, discountType } = req.query
    let currentTime = new Date();

    let dis = discountType ? [discountType] : ['fixed', 'percentage']
    let findFilter = {
        isDeleted: { $ne: true },
        isActive: { $ne: false },
        $or: [
            { giveTo: id },
            { giveToAll: { $ne: false } }
        ],
        'duration.startTime': { $lte: currentTime },
        'duration.endTime': { $gte: currentTime }
    }

    if (promoCode) {
        console.log(currentTime)
        let res = await PromoCodeModel.findOne({
            promoCode,
            ...findFilter
        }, { usedBy: 0 })

        if (!res) return res
        let isUsed = res?.usedBy?.find(x => x == id)
        return isUsed ? {
            error: "you have Already Used this Code"
        } : res
    }
    let res = await PromoCodeModel.find({
        ...findFilter,
        usedBy: { $ne: id },
        Discounttype: { $in: dis },
    }, { usedBy: 0 })
    return res
}

const getMyBookingById = async (req) => {
    let Bookings = await OrderModel.findOne({ customerId: req.user.id, _id: req.params.id }).populate([
        { path: "customerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "vehicleId", select: {
                vehicleManufacturer: 1,
                vehiclePlateNumber: 1,
                vehicleName: 1,
                vehicleType: 1,
                vehicleModel: 1,
            }
        },
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
        }
    ])
    return Bookings
}

const cancelBooking = async (req) => {
    let { cancellationResion } = req.body
    let date = new Date()
    let Bookings = await OrderModel.findByIdAndUpdate(req.params.id, { isCancel: true, cancelBy: "customer", cancellationResion: cancellationResion, status: "cancelled", cancellationTime: date }, { new: true })
    return Bookings
}

const createNewBooking = async (req) => {
    req.body.customerId = req.user.id
    req.body.location = {
        ...req.body.location,
        type: "Point",
        coordinates: [req.body?.location?.long ?? 0, req.body?.location?.lat ?? 0],
    };

    let promoCodeFilter = {
        _id: req.body?.promoCode?.id,
        $or: [
            {
                // 'giveTo': req?.user?.id,
                usedBy: { $ne: req?.user?.id }
            },
            {
                giveToAll: true,
                usedBy: { $ne: req?.user?.id }
            }
        ]
    }
    let paymentId = crypto.randomUUID();
    console.log(paymentId)
    let Shop = await shopModel.findOne({ _id: req.body.shopId }, { shopName: 1 }).populate({
        path: "Owner", select: {
            bankAccount: 1,
            username: 1
        }
    })
    let finalCost = req.body.cost
    if (req.body.promoCode) {
        let promoCode = await PromoCodeModel.findOne(promoCodeFilter)
        if (!promoCode) return { error: "Invalid promo Code" }
        if (promoCode.Discounttype == "fixed") {
            finalCost -= parseFloat(promoCode.discount)
        }
        if (req.body.promoCode.Discounttype == "percentage") {
            finalCost -= parseFloat((promoCode.discount * 100) / req.body.cost)
        }
    }
    let Amount = finalCost;
    if (req.body?.serviceFee) {
        req.body.serviceFee.map(async (fee) => {
            let service = await ServiceModel.findOne({ _id: fee.id })
            if (!service) return { error: "invalid service Id " }
            if (service.feeType == "fixed") {
                return Amount -= service.WashtaFees
            }
            if (service.feeType == "percentage") {
                return Amount -= (service.WashtaFees * 100) / finalCost
            }
        })
    }

    if (!Shop) return { error: "Shop Not Found" }
    if (Shop) {
        let paymentLink = await makeStripePayment(
            Shop?.cost,
            Amount,
            "AED",
            1,
            paymentId,
            {
                id: Shop?._id,
                name: Shop?.shopName
            },
            Shop?.Owner?.bankAccount?.acct_id,
        );
        if (paymentLink) {
            req.body.paymentId = paymentId
            req.body.paymentLink = paymentLink?.url
        }
    }
    req.body.fee = (finalCost - Amount)
    req.body.discount = (req.body.cost - finalCost)
    req.body.finalCost = finalCost
    console.log("Final Body ", req.body)
    let Bookings = await OrderModel({ ...req.body })
    console.log(Bookings)
    if (req.body?.promoCode) {
        let promo = await PromoCodeModel.findOneAndUpdate(promoCodeFilter, { $push: { 'usedBy': req.user.id } })
        console.log(promo)
        if (!promo) return { error: "promo code not Applyed" }
    }
    if (Bookings) await NotificationOnBooking(req)
    return Bookings
}

const getbookingbyStatus = async (req) => {
    let Bookings = await OrderModel.find({ $and: [{ customerId: req.user.id }, { status: req.query.status }] }).populate([
        { path: "customerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "vehicleId", select: {
                vehicleManufacturer: 1,
                vehiclePlateNumber: 1,
                vehicleName: 1,
                vehicleType: 1,
                vehicleModel: 1,
            }
        },
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
        }
    ])
    return Bookings
}


const getAllInvoice = async (req) => {
    let orders = await OrderModel.find({ customerId: req.user.id, status: "completed" }).populate([
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
        if (order?._doc?.orderCompleteAt && order?._doc?.orderAcceptedAt) {
            return order._doc = {
                ...order._doc, duration: getTimeDifferenceFormatted(order._doc.orderAcceptedAt, order._doc.orderCompleteAt)
            }
        }
        return order._doc
    })
    return updatedOrder;
};

const getInvoiceById = async (req) => {
    let { id } = req.params
    let orders = await OrderModel.findOne({ _id: id, customerId: req.user.id, status: "completed" }).populate([
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
    if (orders?._doc?.orderAcceptedAt && orders?._doc?.orderCompleteAt) {
        orders._doc = { ...orders._doc, duration: getTimeDifferenceFormatted(orders._doc.orderAcceptedAt, orders._doc.orderCompleteAt) }
    }
    return orders?._doc;
};


// ----------------------------------------------- Ratings -----------------------------------------------------//

const createShopRating = async (req) => {
    let { orderId, shopId, rating, comment } = req.body
    let { id } = req.user

    let Rating = await ReviewModel({ orderId, shopId, customerId: id, rating, 'comment.text': comment.text }).save()
    await NotificationOnReview(Rating)
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}

const createSellerReview = async (req) => {
    let { orderId, sellerId, rating, comment } = req.body
    let { id } = req.user

    console.log(sellerId)
    let Rating = await ReviewModel({ orderId, sellerId: sellerId, customerId: id, rating, 'comment.text': comment.text }).save()
    await NotificationOnReview(Rating)
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}

const getMyReviews = async (req) => {
    let { id } = req.user
    let { shopId, sellerId } = req.query
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
        let Rating = await ReviewModel.find({ customerId: id, shopId, isDeleted: { $ne: true } }).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Rating)
        return FormatedRating
    }
    if (sellerId) {
        let Rating = await ReviewModel.find({ customerId: id, sellerId }).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Rating)
        return FormatedRating
    }

    let Rating = await ReviewModel.find({ customerId: id, isDeleted: { $ne: true } }).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Rating)
    return FormatedRating
}

const updatesShopReview = async (req) => {
    let { rating, comment } = req.body
    let { reviewId } = req.query

    let Rating = await ReviewModel.findOneAndUpdate({ _id: reviewId, customerId: req.user.id, isDeleted: { $ne: true } }, { rating, 'comment.text': comment.text }, { new: true, fields: { rating: 1, comment: 1 } })
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}


const deleteShopReviews = async (req) => {
    let { reviewId } = req.query
    let Review = await ReviewModel.findOneAndUpdate({ _id: reviewId, customerId: req.user.id, isDeleted: { $ne: true } }, { isDeleted: true, deleteBy: { id: req.user.id, role: 'customer' } }, { new: true });
    if (!Review) return Review
    let FormatedRating = formateReviewsRatingsSingle?.(Review)
    return FormatedRating
}


const getShopReviews = async (req) => {
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
    if (!shopId) return null
    let Reviews = await ReviewModel.find({ shopId, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)

    let newFormatedReviews = formateReviewsRatings(Reviews)
    let stats = getRatingStatistics(newFormatedReviews)
    console.log("Stats ================= ", stats)

    return { reviews: newFormatedReviews, reviewsSummary: stats }
};

const getSellerReview = async (req) => {
    let { sellerId, shopId, limit } = req.query

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

    if (!sellerId && !shopId) return null
    if (sellerId) {
        let Reviews = await ReviewModel.find({ sellerId, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Reviews)
        return FormatedRating
    }
    if (shopId) {
        let owner = await shopModel.findOne({ _id: shopId, isTerminated: { $ne: true } }, { Owner: 1 })
        if (!owner) return null
        let Reviews = await ReviewModel.find({ sellerId: owner.Owner, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Reviews)
        return FormatedRating
    }

};

const updatesSellerReview = async (req) => {
    let { rating, comment } = req.body
    let { reviewId } = req.query

    let Rating = await ReviewModel.findOneAndUpdate({ _id: reviewId, customerId: req.user.id, isDeleted: { $ne: true } }, { rating, 'comment.text': comment.text }, { new: true, fields: { rating: 1, comment: 1 } })
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}


// ----------------------------------------------- agent Reviews -----------------------------------------------------//


const createAgentReview = async (req) => {
    let { agentId, ticketId, rating, comment } = req.body
    let { id } = req.user

    let Rating = await ReviewModel({ agentId, ticketId, customerId: id, rating, 'comment.text': comment.text }).save()
    await NotificationOnReview(Rating)
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}



const updatesAgentReview = async (req) => {
    let { rating, comment } = req.body
    let { reviewId } = req.query

    let Rating = await ReviewModel.findOneAndUpdate({ _id: reviewId, customerId: req.user.id, isDeleted: { $ne: true } }, { rating, 'comment.text': comment.text }, { new: true, fields: { rating: 1, comment: 1 } })
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}


const getAgentReview = async (req) => {
    let { agentId, limit } = req.query

    let populate = [
        { path: "customerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "agentId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } }, ,
        { path: "ticketId" }
    ]

    if (!agentId) return { error: "agent Id Must be required" }
    let Reviews = await ReviewModel.find({ agentId, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    return FormatedRating
};



const makeStripePayment = async (
    amount,
    splitAmount,
    currency,
    quantity,
    paymentId,
    shop,
    acctId,
) => {
    console.log("amount", amount, currency, quantity);
    let price = await stripe.prices.create({
        unit_amount: parseInt(amount ? (amount < 0 ? 1 : amount) : 1) * 100,
        currency: currency,
        product_data: shop,
    });
    console.log(splitAmount)
    const paymentLink = await stripe.paymentLinks.create({
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
        metadata: {
            paymentId: paymentId,
            paymentLink: "testing",
        },
        transfer_data: {
            amount: parseInt(splitAmount) * 100,
            destination: acctId,
            // "acct_1PPaTaC6Xjf4bQv7"
        },
    });
    console.log("paymentlink object", paymentLink);
    return paymentLink;
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
    getVehicles,
    updateVehicles,
    addVehicles,
    deleteVehicle,
    getIsSelected,
    updateIsSelected,
    getAllShops,
    getShopById,
    getMyBookings,
    getMyBookingById,
    createNewBooking,
    getShopByLocation,
    getbookingbyStatus,
    getShopsServicefee,
    getShopsPromoCode,
    cancelBooking,
    createShopRating,
    updatesShopReview,
    getMyReviews,
    getShopReviews,
    getAllInvoice,
    getInvoiceById,
    createSellerReview,
    getSellerReview,
    deleteShopReviews,
    updatesSellerReview,
    updateImage,
    createAgentReview,
    updatesAgentReview,
    getAgentReview,

}