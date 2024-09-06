const socketIo = require('socket.io')
const mongoose = require('mongoose')
const chatRoomModel = require('../models/chatRoom')
const chatMessageModel = require('../models/chatMessage')
const notification = require('../helpers/notification')
const ObjectId = mongoose.Types.ObjectId


module.exports = function (server) {

    let joinedUser = { "extra": [] }
    let ticketData = { "extra": [] }
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
            // console.log(data.ticketId)
            if (data.ticketId) {
                if (!ticketData[data.ticketId]) {
                    let updateConnection = {
                        isSomeOneConnected: true,
                        connectedWith: {
                            id: data.sender.id,
                            username: data.sender.username,
                            role: data.sender.role,
                        }
                    }
                    let ticket = await chatRoomModel.findOneAndUpdate({ _id: data.ticketId }, { $set: { ...updateConnection } }, { new: true })
                    if (!ticket) return io.to(socket.id).emit("error", { error: { messaage: "ticket Not found" } })
                    // if (ticket?.isSomeOneConnected) return io.to(socket.id).emit("error", { error: { messaage: "some one is Already Connected" } })
                    console.log("tk =>>>", ticket)
                    ticketData[data.ticketId] = ticket
                }
                if (joinedUser[data.ticketId] && !joinedUser[data.ticketId].includes(data.sender.id)) {
                    joinedUser[data.ticketId].push(data.sender.id)
                } else if (!joinedUser[data.ticketId]) {
                    joinedUser[data.ticketId] = [data.sender.id]
                }
            }
            socket.join(data.ticketId);
            console.log(`room joined by ${data.sender.id} roomid => ${data.ticketId}`);
            console.log(`ticket => `, ticketData);
        })
        socket.on("end", async (data) => {
            if (ticketData?.[data.ticketId]) {
                let updateConnection = {
                    $set: { isSomeOneConnected: false , requestStatus : data.requestStatus},
                    $unset: { connectedWith: 1 }
                }
                let ticket = await chatRoomModel.findOneAndUpdate({ _id: data.ticketId }, updateConnection, { new: true })
                
                delete ticketData[data.ticketId]
            }
            console.log(ticketData)
            if (joinedUser[data.ticketId]) {
                joinedUser[data.ticketId] = joinedUser[data.ticketId].filter((x) => (data.sender.id !== x))
            }
            console.log(`room leaved by ${data.sender.id} roomid => ${data.ticketId}`);
            socket.leave(data.ticketId);
        })
        socket.on('send-message-to-user', async (data) => {
            // console.log(data)
            if (joinedUser[data.ticketId] && !joinedUser[data.ticketId].includes(data.receiver.id)) {
                console.log("send Notif ----------------------------------------------------- ")
                notification.sendMessageNotif(data.message, data.sender, data.receiver)
            }
            let date = new Date()
            let media = data.media ? { media: data.media } : {}
            let body = {
                ...media,
                message: data.message,
                ticketId: data.ticketId,
                sender: { id: data.sender.id, role: data.sender.role }
            }
            // console.log('message body - - - - - - ', messageBody)
            io.in(data.ticketId).emit("message-receive-from-admin", body);



            // const messageSave = await new chatMessageModel(body).save()
            // console.log("message saved", messageSave)
        })

        socket.on('send-message-to-admin', async (data) => {
            // console.log(data)
            if (joinedUser[data.ticketId] && !joinedUser[data.ticketId].includes(data.receiver.id)) {
                console.log("send Notif ======================================================== ")
                notification.sendMessageNotif(data.message, data.sender, data.receiver)
            }

            let date = new Date()
            let media = data.media ? { media: data.media } : {}
            let body = {
                ...media,
                message: data.message,
                ticketId: data.ticketId,
                sender: { id: data.sender.id, role: data.sender.role }
            }

            io.in(data.ticketId).emit("message-receive-from-user", body);


            // const messageSave = await new chatMessageModel(body).save()
            // console.log("message saved", messageSave)
        })
    })

}