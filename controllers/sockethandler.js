const socketIo = require('socket.io')
const mongoose = require('mongoose')
const chatRoomModel = require('../models/chatRoom')
const messageModel = require('../models/chatMessage')
const notification = require('../helpers/notification')


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
            console.log(socket.id)
            if (data.ticketId) {
                if (!ticketData[data.ticketId]) {
                    let ticket = await chatRoomModel.findOne({ _id: data.ticketId })
                    console.log(ticket)
                    if (!ticket) return io.to(socket.id).emit("errorM", { error: { messaage: "ticket Not found" } })
                    if (ticket?.requestStatus === "resolved" || ticket?.requestStatus === "rejected") return io.to(socket.id).emit("error", { error: { messaage: `This ticket is ${ticket?.requestStatus}` } })
                    if (ticket?.user?.id === data?.sender?.id && ticket?.connectedWith.id === data?.sender?.id && data.sender.role !== "admin") return io.to(socket.id).emit("error", { error: { messaage: `you can not join this room "unAuthorized"` } })

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
            // console.log(`ticket => `, ticketData);
        })
        socket.on("leave", async (data) => {
            if (joinedUser[data.ticketId]) {
                joinedUser[data.ticketId] = joinedUser[data.ticketId].filter((x) => (data.sender.id !== x))
            }
            if (joinedUser[data.ticketId].lenght) delete ticketData[data.ticketId]
            socket.leave(data.ticketId);
        })
        socket.on('send-message-to-user', async (data) => {
            if (joinedUser[data.ticketId] && !joinedUser[data.ticketId].includes(data.receiver.id)) {
                notification.sendMessageNotif(data.message, data.sender, data.receiver)
            }
            let date = new Date()
            let media = data.media ? { media: data.media } : {}
            let body = {
                ...media,
                message: data.message,
                createdAt: date,
                ticketId: data.ticketId,
                sender: { id: data.sender.id, role: data.sender.role }
            }
            // console.log('message body - - - - - - ', messageBody)
            io.in(data.ticketId).emit("message-receive-from-agent", body);
            let savedMessage = await messageModel(body).save();
        })

        socket.on('send-message-to-agent', async (data) => {
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
                createdAt: date,
                ticketId: data.ticketId,
                sender: { id: data.sender.id, role: data.sender.role }
            }

            io.in(data.ticketId).emit("message-receive-from-user", body);
            let savedMessage = await messageModel(body).save();
        })
    })

}