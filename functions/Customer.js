const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
const shopModel = require('../models/shop');
const ReviewModel = require('../models/Review');
const OrderModel = require('../models/Order');
const { getTimeDifferenceFormatted, formateReviewsRatings, formateReviewsRatingsSingle, getRatingStatistics } = require('../helpers/helper');
const { NotificationOnBooking } = require('../helpers/notification');

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
        createdAt: 0,
        updatedAt: 0,
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
        let User = await CustomerModel.findByIdAndUpdate({ _id: req.user.id, isTerminated: { $ne: true } }, { $set: { sessionKey: '' } })
        return User
    }
    if (req.user.role == "seller") {
        let User = await SellerModel.findByIdAndUpdate({ _id: req.user.id, isTerminated: { $ne: true } }, { $set: { sessionKey: '' } })
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
    let Shops = await shopModel.find({})
    let updatedShops = [];
    for (const shop of Shops) {
        let shopReviews = await ReviewModel.find({ shopId: shop?._id })
        let shopOrders = await OrderModel.find({ shopId: shop?._id, status: "completed" })
        let formatedReviews = formateReviewsRatings(shopReviews);
        let stats = getRatingStatistics(formatedReviews);
        let temp = {
            ...shop?._doc,
            reviewsSummary: {
                averageRating: stats.averageRating || 0,
                totalReviews: stats.totalReviews || 0,
            },
            totalNoOfJobs: shopOrders?.length || 0
        }
        updatedShops.push(temp)
    }
    return updatedShops
}

const getShopById = async (req) => {
    let Shops = await shopModel.findById(req.params.id)
    let shopReviews = await ReviewModel.find({ shopId: Shops?._id })
    let shopOrders = await OrderModel.find({ shopId: Shops?._id, status: "completed" })
    let formatedReviews = formateReviewsRatings(shopReviews);
    let stats = getRatingStatistics(formatedReviews);
    let updatedShops = {
        ...Shops?._doc,
        reviewsSummary: {
            averageRating: stats.averageRating || 0,
            totalReviews: stats.totalReviews || 0,
        },
        totalNoOfJobs: shopOrders?.length || 0
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
        let shopReviews = await ReviewModel.find({ shopId: shop?._id })
        let shopOrders = await OrderModel.find({ shopId: shop?._id, status: "completed" })

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
            },
            totalNoOfJobs: shopOrders?.length || 0

        };


    }

    // const shopsWithDistance = Shops.map(shop => {
    //     const distance = haversineDistance(userCoordinates, shop.location.coordinates);
    //     return { ...shop.toObject(), distanceInMeter: parseFloat(distance.toFixed(1)), distanceInKiloMeter: parseFloat((distance / 1000).toFixed(1)) };
    // });
    return shopsWithDistance
}

// ----------------------------------------------- Bookings -----------------------------------------------------//

const getMyBookings = async (req) => {
    let Bookings = await OrderModel.find({ customerId: req.user.id })
    return Bookings
}

const getMyBookingById = async (req) => {
    let Bookings = await OrderModel.findById(req.params.id).populate([
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
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
    req.body.location = {
        ...req.body.location,
        type: "Point",
        coordinates: [req.body?.location?.long ?? 0, req.body?.location?.lat ?? 0],
    };
    let Bookings = await OrderModel({ ...req.body }).save();
    if (Bookings) await NotificationOnBooking(req)
    return Bookings
}

const getbookingbyStatus = async (req) => {
    let Bookings = await OrderModel.find({ $and: [{ customerId: req.user.id }, { status: req.query.status }] }).populate([
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
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
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}

const createSellerReview = async (req) => {
    let { orderId, sellerId, rating, comment } = req.body
    let { id } = req.user

    console.log(sellerId)
    let Rating = await ReviewModel({ orderId, sellerId: sellerId, customerId: id, rating, 'comment.text': comment.text }).save()
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}

const getMyReviews = async (req) => {
    let { id } = req.user
    let { shopId, sellerId } = req.query
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
        let Rating = await ReviewModel.find({ customerId: id, shopId }).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Rating)
        return FormatedRating
    }
    if (sellerId) {
        let Rating = await ReviewModel.find({ customerId: id, sellerId }).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Rating)
        return FormatedRating
    }

    let Rating = await ReviewModel.find({ customerId: id }).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Rating)
    return FormatedRating
}

const updatesShopReview = async (req) => {
    let { rating, comment } = req.body
    let { reviewId } = req.query

    let Rating = await ReviewModel.findOneAndUpdate({ _id: reviewId, customerId: req.user.id }, { rating, 'comment.text': comment.text }, { new: true, fields: { rating: 1, comment: 1 } })
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
    if (!shopId) return null
    let Reviews = await ReviewModel.find({ shopId }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)

    let newFormatedReviews = formateReviewsRatings(Reviews)
    let stats = getRatingStatistics(newFormatedReviews)
    console.log("Stats ================= ", stats)

    return { reviews: newFormatedReviews, reviewsSummary: stats }
};

const getSellerReview = async (req) => {
    let { sellerId, shopId, limit } = req.query

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

    if (!sellerId && !shopId) return null
    if (sellerId) {
        let Reviews = await ReviewModel.find({ sellerId }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Reviews)
        return FormatedRating
    }
    if (shopId) {
        let owner = await shopModel.findOne({ _id: shopId }, { Owner: 1 })
        if (!owner) return null
        let Reviews = await ReviewModel.find({ sellerId: owner.Owner }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        let FormatedRating = formateReviewsRatings?.(Reviews)
        return FormatedRating
    }

};

const updatesSellerReview = async (req) => {
    let { rating, comment } = req.body
    let { reviewId } = req.query

    let Rating = await ReviewModel.findOneAndUpdate({ _id: reviewId, customerId: req.user.id }, { rating, 'comment.text': comment.text }, { new: true, fields: { rating: 1, comment: 1 } })
    if (!Rating) return Rating
    let FormatedRating = formateReviewsRatingsSingle?.(Rating)
    return FormatedRating
}


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
    updateImage
}