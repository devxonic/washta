const CustomerModel = require("../models/Customer");
const NotificationModel = require("../models/notification");
const shopModel = require("../models/shop");
const serviceAccount = require("../google-services_v4.json");
const firebase = require("firebase-admin");
const SellerModel = require("../models/seller");
const AdminModel = require("../models/admin");

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

const NotificationOnOrderUpdate = async (order, message) => {
    try {
        let customer = await CustomerModel.findOne({ _id: order.customerId }, { fullName: 1, username: 1, resizedAvatar: 1 })
        let shop = await shopModel.findOne({ _id: order.shopId }, { shopName: 1, Owner: 1 }).populate({ path: 'Owner', select: { username: 1, deviceId: 1 } })
        let saveMessage = {
            notification: {
                title: customer?.username,
                body: message,
            },
            sender: {
                id: shop?.Owner,
                role: "seller"
            },
            receiver: {
                id: order.customerId,
                role: "customer"
            },
        };
        let message = {
            notification: saveMessage.notification,
            token: customer?.deviceId,
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
            let customer = await CustomerModel.find({}, { deviceId: 1, username: 1, resizedAvatar: 1 })
            customer.map(e => {
                Receivers.push({
                    id: e._id,
                    role: 'customer',
                    username: e.username,
                    avatar: e.resizedAvatar
                })
                if (!e?.deviceId) return
                return tokenArray.push(e?.deviceId)
            })
        }
        if (sendTo == "seller" || sendTo == "both") {
            let seller = await SellerModel.find({}, { deviceId: 1, username: 1, resizedAvatar: 1 })
            seller.map(e => {
                Receivers.push({
                    id: e._id,
                    role: 'seller',
                    username: e.username,
                    avatar: e.resizedAvatar
                })
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
        await firebase.messaging().sendEachForMulticast(message)
        console.log("send message notif success ");
        return notif
    } catch (error) {
        console.error("error in sending notif");
        console.error(error);
    }
};


const getAllMyNotifications = async (req) => {
    let { id } = req.user
    let { limit, skip, date } = req.query

    let startDate = date ? new Date(date) : new Date()
    startDate.setHours(0, 0, 0, 0);
    let endDate = startDate ? new Date(startDate) : new Date()
    endDate.setHours(23, 59, 59, 999);

    let DateFilter = date ? { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate), } } : {}
    let Notifications = await NotificationModel.find({ $or: [{ 'receiver.id': id }, { 'multiReceivers.id': id }], ...DateFilter }, { multiReceivers: 0 }).sort({ createdAt: -1 }).limit(limit ?? null).skip(skip ?? null)
    let UpdatedNotification = []
    for (let i = 0; i < Notifications.length; i++) {
        UpdatedNotification[i] = Notifications[i]
        if (Notifications[i].sender.role == "customer") {
            let customer = await CustomerModel.findOne({ _id: Notifications?.[i].sender.id, isTerminated: { $ne: true } }, { username: 1, resizedAvatar: 1 })
            UpdatedNotification[i].sender = {
                ...Notifications[i].sender,
                profile: customer?.resizedAvatar ?? null,
                username: customer?.username ?? null
            }
            continue;
        }
        if (Notifications[i].sender.role == "seller") {
            let seller = await SellerModel.findOne({ _id: Notifications?.[i].sender.id, isTerminated: { $ne: true } }, { username: 1, resizedAvatar: 1 })
            UpdatedNotification[i].sender = {
                ...Notifications[i].sender,
                profile: seller?.resizedAvatar,
                username: seller?.username
            }
            continue;
        }
        if (Notifications[i].sender.role == "admin") {
            let seller = await AdminModel.findOne({ _id: Notifications[i].sender.id, role: "admin" }, { username: 1, resizedAvatar: 1 })
            UpdatedNotification[i].sender = {
                ...Notifications[i].sender,
                profile: seller?.resizedAvatar,
                username: seller?.username
            }
            continue;
        }
        if (Notifications[i].sender.role == "agent") {
            let seller = await AdminModel.findOne({ _id: Notifications[i].sender.id, role: "agent" }, { username: 1, profile: 1 })
            UpdatedNotification[i].sender = {
                ...Notifications[i].sender,
                profile: seller?.profile,
                username: seller?.username
            }
        }

    }
    return UpdatedNotification;
};


const sendNotificationToAllAgents = async (req) => {
    try {
        let { user } = req.body
        let tokenArray = [];
        let Receivers = [];

        let admins = await AdminModel.find({}, { deviceId: 1, role: 1, username: 1, resizedAvatar: 1 })
        admins.map(e => {
            Receivers.push({
                id: e._id,
                role: e.role,
                username: e.username,
                avatar: e.resizedAvatar
            })
            if (!e?.deviceId) return
            return tokenArray.push(e?.deviceId)
        })

        let saveMessage = {
            notification: {
                title: 'New request',
                body: 'New Support Request is Avilable ',
            },
            sender: {
                id: user.id,
                role: user.role
            },
            multiReceivers: Receivers,
        }
        let message = {
            notification: saveMessage.notification,
            token: tokenArray,
        };
        console.log(saveMessage)
        let notif = await NotificationModel(saveMessage).save();
        await firebase.messaging().sendEachForMulticast(message)
        console.log("send message notif success ");
        return notif
    } catch (error) {
        console.error("error in sending notif");
        console.error(error);
    }
};

const sendMessageNotif = async (msg, sender, receiver, title) => {
    try {
        let saveMessage = {
            notification: {
                title: title ? title : "Received a Message",
                body: msg,
            },
            sender: {
                id: sender.id,
                role: sender.role
            },
            receiver: {
                id: receiver.id,
                role: receiver.role
            }
        };

        let message = {
            notification: saveMessage.notification,
            token: receiver?.deviceId,
        };

        let Notif = await NotificationModel(saveMessage).save();
        let FirebaseNotif = await firebase.messaging().send(message);
        console.log(Notif)
        console.log(FirebaseNotif)
        console.log("send message notif success");
        return Notif
    } catch (error) {
        console.error(error);
    }
};

const NotificationOnReview = async (review) => {
    try {
        console.log( "Review" ,review )
        let agent;
        let seller;
        let shop;
        let customer;
        if (review?.shopId) shop = await shopModel.findOne({ _id: review.shopId }, { shopName: 1, Owner: 1 }).populate({ path: 'Owner', select: { username: 1, deviceId: 1 } })
        if (review?.customerId) customer = await CustomerModel.findOne({ _id: review.customerId }, { fullName: 1, username: 1, resizedAvatar: 1, deviceId: 1 })
        if (review?.sellerId) seller = await SellerModel.findOne({ _id: review.sellerId }, { fullName: 1, username: 1, resizedAvatar: 1, deviceId: 1 })
        if (review?.agentId) agent = await AdminModel.findOne({ _id: review.agentId }, { fullName: 1, username: 1, resizedAvatar: 1, deviceId: 1 })

        let saveMessage = {
            notification: {
                title: "New Review",
                body: review.comment.text,
            },
            sender: {
                id: review?.orderId ? customer?._id : review?.ticketId ? seller?._id ?? customer?._id : customer?._id,
                role: review?.orderId ? "customer" : review?.ticketId ? seller ? "seller" : "customer" : "customer"
            },
            receiver: {
                id: review?.orderId ? shop?.Owner?._id ?? seller?._id : review?.ticketId ? agent?._id : seller?._id,
                role: review?.orderId ? "seller" : review?.ticketId ? "agent" : "seller",
            }
        };
        let message = {
            notification: saveMessage.notification,
            token: review?.orderId ? shop?.Owner?.deviceId : review?.ticketId ? agent?.deviceId : seller?._id,
        };
        let notif = await NotificationModel(saveMessage).save();
        let firebaseNotif = await firebase.messaging().send(message)
        console.log("send message notif success ", notif);
        console.log("firebase Res ", firebaseNotif);
        return notif
    } catch (error) {
        console.error("error in sending notif");
        console.error(error);
    }
};

module.exports = {
    NotificationOnBooking,
    NotificationOnOrderUpdate,
    sendNotificationToAllUsers,
    getAllMyNotifications,
    sendNotificationToAllAgents,
    sendMessageNotif,
    NotificationOnReview,
};
