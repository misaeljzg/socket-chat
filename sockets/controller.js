const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers/generate-jwt");
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

const socketController = async (socket = new Socket(), io) => {

    const user = await checkJWT(socket.handshake.headers['x-token'])

    if (!user) {
        return socket.disconnect();
    }

    //Add active user
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.usersArr);
    io.emit('receive-messages', chatMessages.last10);

    //Connect user to a special lobby
    socket.join(user.id); //Global, socket.id, user.id

    //Clear when someone disconnects
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
        io.emit('active-users', chatMessages.usersArr);
    });

    socket.on('send-message', ({ uid, message }) => {
        if (uid) {
            //Private message
            socket.to(uid).emit('private-message', {from: user.name, message})
        } else {

            chatMessages.sendMessage(user.id, user.name, message);
            io.emit('receive-messages', chatMessages.last10);
        }

    });

}

module.exports = {
    socketController
}