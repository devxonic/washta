const CustomerModel = require("../models/Customer");
const NotificationModel = require("../models/notification");
const shopModel = require("../models/shop");
const chatRoomModel = require("../models/chatRoom");


const craeteNewSupportRoom = async (req) => {
    try {
        let { name, title, user } = req.body
        let body = {
            name,
            title,
            users: [user],
        }
        console.log(body)
        let newChatRoom = await new chatRoomModel(body).save();
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
        if (id) {
            let chatRoom = chatRoomModel.findOne({ _id: id }) // add end Filter 
            return chatRoom
        }
        console.log(req.user.id)

        let filter = status ? { requestStatus: status, 'users.id': req.user.id } : { 'users.id': req.user.id }
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
