const CustomerModel = require("../models/Customer");
const NotificationModel = require("../models/notification");
const shopModel = require("../models/shop");
const serviceAccount = require("../google-services_v4.json");
const firebase = require("firebase-admin");
const SellerModel = require("../models/seller");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
})

const NotificationOnBooking = async (req) => {
    try {
        let shop = await shopModel.findOne({ _id: req.body.shopId }, { shopName: 1, Owner: 1 }).populate({ path: 'Owner', select: { username: 1, deviceId: 1 } })
        let customer = await CustomerModel.findOne({ _id: req.user.id }, { fullName: 1, username: 1, resizedAvatar: 1 })
        let saveMessage = {
            notification: {
                title: customer?.username,
                body: `you received order for "${shop.shopName}"`,
            },
            sender: {
                id: req.body.customerId,
                role: "customer"
            },
            receiver: {
                id: shop?.Owner,
                role: "seller"
            }
        };
        let message = {
            notification: saveMessage.notification,
            token: shop?.Owner?.deviceId,
        };
        let notif = await NotificationModel(saveMessage).save();
        await firebase.messaging().send(message)
        console.log("send message notif success ", notif);
        return notif
    } catch (error) {
        console.error("error in sending notif");
        console.error(error);
    }
};

const sendNotificationToAllUsers = async (req) => {
    try {
        let { sendTo } = req.query
        let tokenArray = [];
        let Receivers = [];

        if (sendTo == "customer" || sendTo == "both") {
            let customer = await CustomerModel.find({}, { deviceId: 1 })
            customer.map(e => {
                Receivers.push({ id: e._id, role: "customer" })
                if (!e?.deviceId) return
                return tokenArray.push(e?.deviceId)
            })
        }
        if (sendTo == "seller" || sendTo == "both") {
            let seller = await SellerModel.find({}, { deviceId: 1 })
            seller.map(e => {
                Receivers.push({ id: e._id, role: "seller" })
                if (!e?.deviceId) return
                return tokenArray.push(e?.deviceId)
            })
        }
        console.log(Receivers)
        let saveMessage = {
            notification: {
                title: req.body.title,
                body: req.body.body,
            },
            sender: {
                id: req.user.id,
                role: "admin"
            },
            multiReceivers: Receivers,
        }
        let message = {
            notification: saveMessage.notification,
            token: tokenArray,
        };
        console.log(saveMessage)
        let notif = await NotificationModel(saveMessage).save();
        await firebase.messaging().sendMulticast(message)
        console.log("send message notif success ");
        return notif
    } catch (error) {
        console.error("error in sending notif");
        console.error(error);
    }
};


module.exports = {
    NotificationOnBooking,
    sendNotificationToAllUsers
};
