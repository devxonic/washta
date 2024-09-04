const socketIo = require('socket.io')
const mongoose = require('mongoose')
const chatRoomModel = require('../models/chatRoom')
const chatMessageModel = require('../models/chatMessage')
const ObjectId = mongoose.Types.ObjectId


module.exports = function (server) {

    let joinedUser = { "extra": [] }
    let chatRoomData = { "extra": [] }
    let io = socketIo(server, {
        cors: {
            origin: "*"
        },
        pingInterval: 10000,
        pingTimeout: 60000,
        transports: ['websocket', 'polling'],
    });
    io.on('connection', (socket) => {
        socket.on("join", async (data) => {
            if (data.chatRoomId) {
                if (!chatRoomData[data.chatRoomId]) {
                    let chatRoom = await chatRoomModel.findOne({ _id: data.chatRoomId }) // add filter to ended rooms
                    chatRoomData[data.chatRoomId] = chatRoom
                }
                if (joinedUser[data.chatRoomId] && !joinedUser[data.chatRoomId].includes(data.user.id)) {
                    joinedUser[data.chatRoomId].push(data.user.id)
                } else if (!joinedUser[data.chatRoomId]) {
                    joinedUser[data.chatRoomId] = [data.user.id]
                }
            }
            socket.join(data.chatRoomId);
            console.log(`room joined by ${socket.id} roomid => ${data.chatRoomId}`);
            console.log(joinedUser)
            console.log(chatRoomData)
        })
        socket.on('send-message-user', async (data) => {
            console.log(data)
            if (joinedUser[data.chatRoomId] && !joinedUser[data.chatRoomId].includes(data.customerId)) {
                console.log("send Notif")
                // notification.sendMessageNotif(data.message, data.user, receiver, "player")
            }
            io.in(data.chatRoomId).emit("message-receive-from-admin", data.message);

            let body = data?.media ? {
                message: data.message,
                media: data.media,
                chatRoomId: data.chatRoomId,
                senderId: { id: data.user.id, role: data.user.role }
            } : {
                message: data.message,
                chatRoomId: data.chatRoomId,
                senderId: { id: data.user.id, role: data.user.role }
            }

            const messageSave = await new chatMessageModel(body).save()
            console.log("message saved", messageSave)
        })

        socket.on('send-message-to-admin', async (data) => {
            console.log(data)
            if (joinedUser[data.chatRoomId] && !joinedUser[data.chatRoomId].includes(data.customerId)) {
                console.log("send Notif")
                // notification.sendMessageNotif(data.message, data.user, receiver, "player")
            }
            io.in(data.chatRoomId).emit("message-receive-from-user", data.message);

            let body = data?.media ? {
                message: data.message,
                media: data.media,
                chatRoomId: data.chatRoomId,
                senderId: { id: data.user.id, role: data.user.role }
            } : {
                message: data.message,
                chatRoomId: data.chatRoomId,
                senderId: { id: data.user.id, role: data.user.role }
            }

            const messageSave = await new chatMessageModel(body).save()
            console.log("message saved", messageSave)
        })
    })

}