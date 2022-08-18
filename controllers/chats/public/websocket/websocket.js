function setRoomId(e) {
    e.preventDefault();
    var id = e.target.dataset.id; // .innerText.trim()
    if (!n.bind.rooms[id]) n.bind.rooms[id] = []

    typeMessage.innerText = 'Member ' + e.target.innerText.trim()
    typeMessage.dataset.id = id
    n.bind.currentRoom = n.bind.rooms[id]

    return false;
}

//var socket

var scope = n.bind
var ctrName = '/chats/'
var sendToRoom = () => {
        var message = messageField.value;
        messageField.value = ''

        var id = typeMessage.dataset.id
        socket.emit(ctrName + 'room', {
            data: message,
            id: id // to id
        });

        if (!scope.rooms[id]) scope.rooms[id] = []

        scope.rooms[id].push({
            data: message,
            type: 'sent'
        })

        //alert('ok')
    },
    broadcastSend = () => {
        // Retrieve the message from the textarea.
        var message = messageField.value;

        // Send the message through the WebSocket.
        socket.emit(ctrName + 'message', {
            data: message,
            id: socket.id
        });

        // Add the message to the messages list.
        scope.broadcast.push({
            data: message,
            type: 'Sent'
        })
        scope.countAllSMS = scope.broadcast.length
        scope.currentRoom = scope.broadcast
    }

function myController(scope) {

    scope.broadcast = []
    scope.rooms = {}
    scope.rooms1 = []
    scope.currentRoom = []

    scope.countAllSMS = 0

    // Handle any errors that occur.
    // socket.onerror = function(error) {
    //     console.log('WebSocket Error: ' + error);
    // };

    //event of socket
    socket.init(ctrName, {
        connect: () => {
            socketStatus.innerHTML = 'Connected ' + socket.id
            socketStatus.className = 'open';
        },
        disconnect: (reason) => {
            socketStatus.innerHTML = 'Disconnected from WebSocket.';
            socketStatus.className = 'closed';
        },
        init: (received) => {
            //userName.innerHTML = JSON.stringify(received)
            console.log('init ', received)
            userName.value = received.name
            userName.dataset.oldName = received.name
            userName.dataset.id = received.id 
                //showMember(received.users)
            n.bind.users = received.users
        },
        join: (received) => {
            //showMember(received.users)
            n.bind.users = received.users
        },
        changename: (received) => {
            var {
                oldName,
                newName
            } = received
            var oldId = '#user-' + oldName.replace(/\s/g, '-')
            var newId = '#user-' + newName.replace(/\s/g, '-')
            var one = userList.querySelector('#' + received.id)
                //one.id = newId
            one.querySelector('a').innerHTML = newName
        },
        userleft: (received) => {
            var one = userList.querySelector('#' + received.id)
                //if(one)
            one.remove()
        },
        room: (sms) => {
            var me = userList.querySelector('a[data-id="' + sms.from + '"]')

            if (!n.bind.rooms[sms.from]) n.bind.rooms[sms.from] = []

            //sms.from

            n.bind.rooms[sms.from].push({
                data: sms.data,
                type: 'received'
            })

            typeMessage.innerText = 'Member ' + me.innerText
            typeMessage.dataset.id = sms.from
            n.bind.currentRoom = n.bind.rooms[sms.from]
        },
        message: (received) => {
            n.bind.broadcast.push({
                data: received.data,
                type: 'Received'
            })
            n.bind.countAllSMS = n.bind.broadcast.length
            n.bind.currentRoom = n.bind.broadcast
            typeMessage.innerText = 'All SMS'
        },
        create: (received) => {
            //create
            console.log(received);
            scope.rooms1.push(received)
        },
        talkRoom: (received) => {
            //create
            console.log(received);
            // scope.rooms1.push(received)
            n.bind.rooms[received.id].push({
                data: received.data,
                type: 'received'
            })

            typeMessage.innerText = 'Room ' + me.innerText
            typeMessage.dataset.id = received.id
            n.bind.currentRoom = n.bind.rooms[received.id]
        }
    })
}
//var ctr = ()(n.bind);
var ctr = {};
n.load = () => {
    ctr = new myController(n.bind);

    // Send a message when the form is submitted.
    messageForm.onsubmit = function(e) {
        e.preventDefault();
        if (typeMessage.innerText.indexOf('All') != -1)
            broadcastSend()
        if (typeMessage.innerText.indexOf('Member') != -1)
            sendToRoom()
        if (typeMessage.innerText.indexOf('Room') != -1)
            sendTalkRoom()
            // Clear out the message field.
        messageField.value = '';

        return false;
    };

    // Close the WebSocket connection when the close button is clicked.
    closeBtn.onclick = function(e) {
        e.preventDefault();

        // Close the WebSocket.
        socket.close();

        return false;
    };

    userForm.onsubmit = () => {
        socket.emit(ctrName + 'changename', {
            oldName: userName.dataset.oldName,
            newName: userName.value
        });
        //alert('submit')
        //console.log('/websocket/changename',{oldName:userName.dataset.oldName,newName:userName.value})
        return false
    };
    allSms.onclick = () => {
        typeMessage.innerText = "All SMS"
        scope.currentRoom = scope.broadcast
    }
    bntCreateRoom.onclick = () => {
        //alert('ok')
        socket.emit(ctrName + 'create', {
            'roomname': roomName.value
        })
        n.bind.rooms1.push({
            'roomname': roomName.value
        })
    }
}

var sendTalkRoom = () => {
    var message = messageField.value;
    messageField.value = ''

    var id = typeMessage.dataset.id
    socket.emit(ctrName + 'talkRoom', {
        data: message,
        id: id // to id
    });

    if (!scope.rooms[id]) scope.rooms[id] = []

    scope.rooms[id].push({
        data: message,
        type: 'sent'
    })

    //socket.emit(ctrName+'talkRoom',)
}

//#EVENT
var
    talkRoom = (e) => {
        e.preventDefault();
        //alert('talkRoom '+event.target.innerText)

        var id = e.target.innerText.trim()


        if (!n.bind.rooms[id]) n.bind.rooms[id] = []

        typeMessage.innerText = 'Room ' + e.target.innerText.trim()
        typeMessage.dataset.id = id

        n.bind.currentRoom = n.bind.rooms[id]
    },
    joinRoom = (e) => {
        socket.emit(ctrName + 'joinRoom', {
            'roomname': roomName.value
        })
    }