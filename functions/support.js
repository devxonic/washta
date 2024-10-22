const CustomerModel = require("../models/Customer");
const NotificationModel = require("../models/notification");
const notificationFunctions = require("../helpers/notification");
const shopModel = require("../models/shop");
const chatRoomModel = require("../models/chatRoom");


const craeteNewSupportRoom = async (req) => {
    try {
        let { title, user } = req.body
        let body = {
            title,
            user,
        }
        console.log(body)
        let newChatRoom = await new chatRoomModel(body).save();
        notificationFunctions.sendNotificationToAllAgents(req)
        return newChatRoom
    } catch (error) {
        console.error("error in Craete chat Room");
        console.error(error);
    }
};

const getSupportRoom = async (req) => {
    try {
        let { status } = req.query
        let { id } = req.params

        let userFilter = req.user.role == "admin" ? {} : { 'user.id': req.user.id }
        
        if (id) {
            let chatRoom = chatRoomModel.findOne({ _id: id, ...userFilter }) // add end Filter 
            return chatRoom
        }

        let filter = status ? { requestStatus: status, ...userFilter } : userFilter
        let chatRooms = chatRoomModel.find(filter)
        return chatRooms
    } catch (error) {
        console.error("error in Craete chat Room");
        console.error(error);
    }
};


module.exports = {
    craeteNewSupportRoom,
    getSupportRoom
};
