const CustomerModel = require("../models/Customer");
const NotificationModel = require("../models/notification");
const shopModel = require("../models/shop");

const NotificationOnBooking = async (req) => {
    try {
        let shop = await shopModel.findOne({ _id: req.body.shopId }, { shopName: 1, Owner: 1 })
        let customer = await CustomerModel.findOne({ _id: req.body.customerId }, { fullName: 1, username: 1, profile: 1 })
        let message = {
            notification: {
                title: customer?.username,
                body: `you received order for "${shop.shopName}"`,
            },
            sender: {
                id: req.body.customerId,
                role: "customer"
            },
            receiver: {
                id: shop.Owner,
                role: "seller"
            }
        };
        let Nofit = await NotificationModel(message).save();
        console.log("send message notif success ", Nofit);
    } catch (error) {
        console.error("error in sending notif");
        console.error(error);
    }
};



module.exports = {
    NotificationOnBooking,
};
