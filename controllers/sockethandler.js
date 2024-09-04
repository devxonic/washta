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
        socket.on("join", (data) => {
            if (data.chatRoomId) {
                if (joinedUser[data.chatRoomId] && !joinedUser[data.chatRoomId].includes(data.user.id)) {
                    joinedUser[data.chatRoomId].push(data.user.id)
                } else if (!joinedUser[data.chatRoomId]) {
                    joinedUser[data.chatRoomId] = [data.user.id]
                }
            }
            console.log(`room joined by ${socket.id} roomid => ${data.chatRoomId}`);
            console.log(joinedUser)
        })
        socket.on('craete-new-request', async (data) => {
            console.log(data)
            // let body = {

            // }
            // let newRequest  = chatRoomModel()
            // let agents = await chatRoomModel.findOne({ users: userArr })
            // let findRoom = await chatRoomModel.findOne({ users: userArr })



            console.log('foundroom', findRoom)
        })
    })

}