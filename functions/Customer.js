const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
const shopModel = require('../models/shop');
const ReviewModel = require('../models/Review');
const OrderModel = require('../models/Order');
const { getTimeDifferenceFormatted } = require('../helpers/helper');
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
    let player = await CustomerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { sessionKey: token } })
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

    let Customer = await CustomerModel.findOneAndUpdate({ email: req.user.email },
        { $set: { fullname: req.bodyfullName, phone: req.bodyphone } }, { new: true });
    let car = await VehiclesModel.findOneAndUpdate({ _id: req.body.car._id },
        { $set: { ...req.body.car } }, { new: true });

    let UpdatedRes = { ...Customer._doc }
    delete UpdatedRes.notification
    delete UpdatedRes.privacy
    delete UpdatedRes.security

    console.log(UpdatedRes, "Updated res")
    console.log(Customer)
    console.log(car)
    return { Customer: UpdatedRes, car };
}

const getProfile = async (req) => {
    let Customer = await CustomerModel.findOne({ username: req.user.username }, {
        password: 0, __v: 0, notification: 0,
        privacy: 0,
        security: 0,
        createdAt: 0,
        updatedAt: 0,
    });
    let car = await VehiclesModel.findOne({ $and: [{ Owner: Customer._id }, { isSelected: true }] }, { __v: 0 });
    return { Customer, car };
}


const updateNotification = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { notification: req.body } })
    return player
}

const getNotification = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return player.notification;
}
const updatePrivacy = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { privacy: req.body } })
    return player
}

const getPrivacy = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return player.privacy;
}
const updateSecurity = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { security: req.body } })
    return player
}

const getSecurity = async (req) => {
    let player = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
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
    let vehicle = await VehiclesModel.findByIdAndDelete({ _id: id })
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
    return Shops
}

const getShopById = async (req) => {
    let Shops = await shopModel.findById(req.params.id)
    return Shops
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
    const shopsWithDistance = Shops.map(shop => {
        const distance = haversineDistance(userCoordinates, shop.location.coordinates);
        return { ...shop.toObject(), distanceInMeter: parseFloat(distance.toFixed(1)), distanceInKiloMeter: parseFloat((distance / 1000).toFixed(1)) };
    });
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
// ----------------------------------------------- Ratings -----------------------------------------------------//

const createShopRating = async (req) => {
    let { orderId, shopId, rating, comment } = req.body
    let { id } = req.user

    let Rating = await ReviewModel({ orderId, shopId, customerId: id, rating, 'comment.text': comment.text }).save()
    return Rating
}

const getMyReviews = async (req) => {
    let { id } = req.user
    let { shopId } = req.query
    if (shopId) {
        let Rating = await ReviewModel.find({ customerId: id, shopId }).populate([
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
                    customerId : 0,
                    vehicleId : 0,
                    shopId : 0,
                    location : 0,
                }
            }
        ])
        return Rating
    }
    let Rating = await ReviewModel.find({ customerId: id })
    return Rating
}

const updatesShopReview = async (req) => {
    let { rating, comment } = req.body
    let { id } = req.params

    let Rating = await ReviewModel.findOneAndUpdate({ _id: id }, { rating, 'comment.text': comment.text }, { new: true, fields: { rating: 1, comment: 1 } })
    return Rating
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
}