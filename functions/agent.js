
const chatRoomModel = require('../models/chatRoom');
const response = require('../helpers/response');
const agentFunctoins = require('../functions/agent');

// ----------------------------------------------- help/support -----------------------------------------------------//

const getSupportRoom = async (req, res) => {
    let { status, New } = req.query
    let { id } = req.params

    console.log(New)
    let sts = status ? { requestStatus: status } : {}
    let isNew = New == "true" ? { isSomeOneConnected: { $ne: true } } : { 'connectedWith.id': req?.user?.id }

    let filter = {
        ...sts,
        ...isNew
    }
    console.log(filter)
    if (id) {
        let chatRoom = await chatRoomModel.findOne({ _id: id, 'connectedWith.id': req?.user?.id })
        return chatRoom
    }
    let chatRoom = await chatRoomModel.find({ ...filter })
    return chatRoom
}

const acceptSupportRequest = async (req, res) => {
    let { id } = req.params

    let body = {
        isSomeOneConnected: true,
        requestStatus: "ongoing",
        connectedWith: {
            id: req.user.id,
            username: req.user.username,
            role: "agent",
        }
    }
    let chatRoom = await chatRoomModel.findOneAndUpdate({ _id: id, isSomeOneConnected: { $ne: true } }, { $set: body })
    return chatRoom
}




module.exports = {
    getSupportRoom,
    acceptSupportRequest,
}