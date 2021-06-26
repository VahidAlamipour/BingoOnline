const allUsers = [];
const startedRooms = [];
class Users {
    addUser(id, name, room, isCreateRoom) {
        const usersInRoom = this.getUsers(room);
        if (isCreateRoom) {
            if (usersInRoom.length > 0) return { error: 'this roomId already exist!!!!' };
        } else {
            if (usersInRoom.length != 1) return { error: 'this room is not valid!!!!!!' };
        }
        const user = { id, name, room, isHost: isCreateRoom, myTurn: false };
        allUsers.push(user);

        return { user }
    }
    getUsers(roomId) {
        if (roomId) {
            return allUsers.filter(x => x.room == roomId);
        }
        return allUsers;
    }
    addToStartedRooms(roomId) {
        let roomUsers = this.getUsers(roomId);
        if (roomUsers.length > 1) {
            startedRooms.push(roomId);
            return { roomId }
        } else {
            return { error: 'Please wait for a competitor' }
        }
    }
    getStartesRooms() {
        return startedRooms;
    }
    checkRoomIsStarted(roomId) {
        return startedRooms.some(roomId);
    }
    whoseTurnIsIt(roomId) {
        var allMembers = this.getUsers(roomId);
        let index = allMembers.findIndex(x => x.myTurn);
        if (index >= 0) {
            allMembers.forEach(element=>{
                element.myTurn = false;
            });
            if (allMembers[index + 1]) {
                allMembers[index + 1].myTurn = true;
                return allMembers[index + 1];
            }
        }
        allMembers[0].myTurn = true;
        return allMembers[0];
    }
}
module.exports = new Users();