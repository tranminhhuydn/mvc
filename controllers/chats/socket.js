var fs = require('fs');
var userNames = (function() {
    var names = {};
    var ids = {}
        /*
        'Guest 1':true,
        'Guest 2':true
        */
        /* ids 
        'Guest 1':123,
        'Guest 2':567
        */
    var claim = function(name, socket) {
        if (!name || names[name]) {
            return false;
        } else {
            ids[name] = socket.id
            names[name] = true;
            return true;
        }
    };

    // find the lowest unused "guest" name and claim it
    var getGuestName = function(socket) {
        var name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!claim(name, socket));

        return name;
    };

    // serialize claimed names as an array
    var get = function() {
        var res = [];
        for (user in names) {
            res.push({
                name: user,
                id: ids[user]
            });
        }
        return res;
    };

    var free = function(name) {
        if (names[name]) {
            delete ids[name];
            delete names[name];
        }
    };

    return {
        claim: claim,
        free: free,
        get: get,
        getGuestName: getGuestName
    };
}());

module.exports = function(io, socket, ctrName) {
    var clientName
    clientName = userNames.getGuestName(socket);
    //START INIT
    // send the new user their name and a list of users
    socket.emit(ctrName + 'init', {
        name: clientName,
        id: socket.id,
        users: userNames.get()
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit(ctrName + 'join', {
        name: clientName,
        id: socket.id,
        users: userNames.get()
    });
    //#END INIT
    return {
        connect: () => {
            console.log('WebSocket connect');
        },

        // clean up when a user leaves, and broadcast it to other users
        disconnect: () => {
            //var socket = this
            console.log('....disconnect '+socket.id)
            socket.broadcast.emit(ctrName + 'userleft', {
                name: clientName,
                id: socket.id
            });
            userNames.free(clientName);
        },
        disconnecting:(reason)=>{
            console.log('....disconnecting '+socket.id)
            console.log('reason ',reason)
                   //socket.on("disconnecting", (reason) => {
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.to(room).emit(ctrName + 'userleft', {
                        name: clientName,
                        id: socket.id
                    })
                    userNames.free(clientName);
                }
            }

        },

        // validate a user's name change, and broadcast it on success
        changename: (received) => {
            //var socket = this
            var {
                oldName,
                newName
            } = received
            if (userNames.claim(newName, socket)) {
                userNames.free(oldName);

                socket.broadcast.emit(ctrName + 'changename', {
                    oldName: oldName,
                    newName: newName,
                    id:socket.id
                });
            }
        },
        room: (received) => {
            //var socket = this
            received.from = socket.id
            socket.to(received.id).emit(ctrName + 'room', received)
        },
        roomgroup: (received) => {
            //var socket = this
            if (received.members) {
                var catchE
                received.members.map((e) => {
                        console.log('--e--', e)
                            //catchE = socket.to(e.id)
                        received.from = socket.id
                        socket.to(e).emit(ctrName + 'roomgroup', received)
                    })
                    //catchE.emit(ctrName + 'roomgroup', received.data)
            }
        },
        message: (received) => {
            //var socket = this
            // socket.broadcast.emit('/websocket/message', {
            //         data: received
            // })
            // return {
            //     broadcast: 1,
            //     data: received
            // }
            console.log('   socket.rooms')
            console.log(socket.rooms)
            for (const room of socket.rooms) {
                console.log(room)
            }
            received.broadcast = 1
            return received
        },
        create: (received) => { // create room
            //var socket = this
            socket.join(received.roomname);
            //socket.to(data.id).emit(ctrName+'create', data)
            console.log('->createRoom : ',received.roomname)
            received.broadcast = 1
            return received
        },
        joinRoom: (received) => { // create room
            //var socket = this
            socket.join(received.roomname);
            //socket.to(data.id).emit(ctrName+'create', data)
            console.log('->joinRoom : ',received.roomname)
        },
        talkRoom:(received)=>{
            // received.broadcast = 1
            // return received
            console.log('->talkRoom : ',received)
            socket.in(received.id).emit(ctrName+'talkRoom',received)
        }
    }
};