const socketIo = require('socket.io')
const mongoose = require('mongoose')
const chatRoomModel = require('../models/chatRoom')
const chatMessageModel = require('../models/chatMessage')
const ObjectId = mongoose.Types.ObjectId


module.exports = function (server) {

    let joinedUser = { "extra": [] }
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
                if (joinedUser[data.chatRoomId] && !joinedUser[data.chatRoomId].includes(data.sender.id)) {
                    joinedUser[data.chatRoomId].push(data.sender.id)
                } else if (!joinedUser[data.chatRoomId]) {
                    joinedUser[data.chatRoomId] = [data.sender.id]
                }
            }
            socket.join(data.chatRoomId);
            console.log(`room joined by ${data.sender.id} roomid => ${data.chatRoomId}`);
        })
        socket.on("leave", (data) => {
            if (joinedUser[data.chatRoomId]) {
                joinedUser[data.chatRoomId] = joinedUser[data.chatRoomId].filter((x) => (data.sender.id !== x))
            }
            console.log(`room leaved by ${data.sender.id} roomid => ${data.chatRoomId}`);
            socket.leave(data.chatRoomId);
        })
        socket.on('send-message-to-user', async (data) => {
            // console.log(data)
            if (joinedUser[data.chatRoomId] && !joinedUser[data.chatRoomId].includes(data.receiver.id)) {
                console.log("send Notif ----------------------------------------------------- ")
                // notification.sendMessageNotif(data.message, data.sender, receiver, "player")
            }
            let date = new Date()
            let media = data.media ? { media: data.media } : {}
            let messageBody = {
                ...media,
                message: data.message,
                createdAt: date
            }
            // console.log('message body - - - - - - ', messageBody)
            io.in(data.chatRoomId).emit("message-receive-from-admin", messageBody);

            let body = {
                ...media,
                message: data.message,
                chatRoomId: data.chatRoomId,
                sender: { id: data.sender.id, role: data.sender.role }
            }

            const messageSave = await new chatMessageModel(body).save()
            // console.log("message saved", messageSave)
        })

        socket.on('send-message-to-admin', async (data) => {
            // console.log(data)
            if (joinedUser[data.chatRoomId] && !joinedUser[data.chatRoomId].includes(data.receiver.id)) {
                console.log("send Notif ======================================================== ")
                // notification.sendMessageNotif(data.message, data.sender, receiver, "player")
            }

            let date = new Date()
            let media = data.media ? { media: data.media } : {}
            let messageBody = {
                ...media,
                message: data.message,
                createdAt: date
            }

            io.in(data.chatRoomId).emit("message-receive-from-user", messageBody);

            let body = {
                ...media,
                message: data.message,
                chatRoomId: data.chatRoomId,
                sender: { id: data.sender.id, role: data.sender.role }
            }

            const messageSave = await new chatMessageModel(body).save()
            // console.log("message saved", messageSave)
        })
    })

}