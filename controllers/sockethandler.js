const socketIo = require('socket.io')


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
            if (joinedUser[data.chatRoomId] && !joinedUser[data.chatRoomId].includes(data.user.id)) {
                joinedUser[data.chatRoomId].push(data.user.id)
                console.log(joinedUser[data.chatRoomId].includes(data.user.id))
                console.log("join New")
            } else {
                console.log("create new room")
                joinedUser[data.chatRoomId] = [data.user.id]
            }
            console.log(`room joined by ${socket.id} roomid => ${data.chatRoomId}`);
            console.log(joinedUser)
        })
        socket.on('send-message-to-care', async (data) => { 

         })
    })

}