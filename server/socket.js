const Users = require('./Users');

module.exports = function (io) {
    io.on('connect', (socket) => {
        console.log('socket connected! ', socket.id);
        socket.on('join', () => {
            console.log('join !!!!!!!!')
        });
        socket.on('startGame', ({ name, room, isCreateRoom }, callback) => {
            const { user, error } = Users.addUser(socket.id, name, room, isCreateRoom);
            if (error) return callback(error);
            socket.join(room);
            const usersInThisRoom = Users.getUsers(room);
            socket.emit('roomStarted', { name, roomId: room, isHost: isCreateRoom })
            io.to(room).emit('membersChanged', usersInThisRoom)
            callback();
        });
        socket.on('clickCell', ({ brand, user }, callback) => {
            io.to(user.room).emit('cellClicked', { brand, turnOf: Users.whoseTurnIsIt(user.room) });
        });
        socket.on('disconnec', () => {
            console.log('socket Disconnected')
        });
        socket.on('startPlaying', (roomId, callback) => {
            const { error } = Users.addToStartedRooms(roomId);
            if (error) return callback(error);

            io.to(roomId).emit('gameStarted', { turnOf: Users.whoseTurnIsIt(roomId) });
            callback();
        });
        socket.on('endGame', ({ name, room }, callback) => {
            var res = Users.addScore(name, room);
            console.log('===> ',res);
            io.to(room).emit('gameEnded', name);
            callback();
        });
        socket.on('restartGame', (roomId, callback) => {
            io.to(roomId).emit('gameRestarted')
            callback();
        })

    });
}
