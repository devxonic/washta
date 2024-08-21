const socketIo = require('socket.io')


module.exports = function (server) {
    let io = socketIo(server, {
        cors: {
            origin: "*"
        },
        pingInterval: 10000,
        pingTimeout: 60000,
        transports: ['websocket', 'polling'],
    });
    io.on('connection', (socket) => {
        console.log("new user Connected " , socket.id)
    })

}