var rooms = {}
var roomGroup = {}

function showRoomSMS(id) {
    roomMessagesList.innerHTML = ''
    rooms[id].map((e) => {
        if (e.type == 'send')
            roomMessagesList.innerHTML += '<li class="sent"><span>Send:</span>' + e.data +
            '</li>';
        if (e.type == 'received')
            roomMessagesList.innerHTML += '<li class="received"><span>Received:</span> ' +
            e.data + '</li>';
    })
}

function setRoomId(e) {
    var id = e.dataset.id;// .innerText.trim()

    roomId.innerHTML = e.innerText.trim()
    roomId.setAttribute('data-id',id)

    if (!rooms[id]) rooms[id] = []

    showRoomSMS(id)

    return false;
}

function showRoomGroupSMS(id,_roomName) {
    
    roomId.innerHTML = _roomName

    roomMessagesList.innerHTML = ''
    roomGroup[_roomName].data.map((e) => {
        if (e.type == 'send')
            roomMessagesList.innerHTML += '<li class="sent"><span>Send:</span>' + e.data +
            '</li>';
        if (e.type == 'received')
            roomMessagesList.innerHTML += '<li class="received"><span>Received:</span> ' +
            e.data + '</li>';
    })
    console.log('id: %s name: %s',id,_roomName)
}

function setRoomGroup(e) {
    e.preventDefault();
    var idList = e.target.dataset.listId
    
    roomId.innerHTML = e.target.innerText.trim()
    roomId.dataset.idList = idList

    initRoomGroup(e.target.innerText)

    showRoomGroupSMS(idList,e.target.innerText)
}
function showRoomGroupName(){
    idRooms.innerHTML = ''

    for(var k in roomGroup){
        var list = roomGroup[k].members.join(',')
        idRooms.innerHTML += `<li><a href="#" onclick=setRoomGroup(event) data-list-id="{{list}}">{{name}}</a> <span>({{length}})</span></li>`
        .replace('{{name}}',k)
        .replace('{{list}}',list)
        .replace('{{length}}',roomGroup[k].members.length)
    }

    

}
function initRoomGroup(name){
    if (!roomGroup[name]) {
        roomGroup[name] = {}
        roomGroup[name].members = []
        roomGroup[name].data = []
    }
}
function setMember(e) {
    e.preventDefault();

    console.log('setRoomGroup')

    // if(!roomGroup[n.bind.roomName]){
    //     roomGroup[n.bind.roomName] = {}
    //     roomGroup[n.bind.roomName].members = []
    //     roomGroup[n.bind.roomName].data = []
    // }

    initRoomGroup(n.bind.roomName)

    if(roomGroup[n.bind.roomName].members.indexOf(e.target.dataset.id)==-1)
        roomGroup[n.bind.roomName].members.push(e.target.dataset.id)

    if(roomGroup[n.bind.roomName].members.indexOf(socket.id)==-1)
        roomGroup[n.bind.roomName].members.push(socket.id)

    showRoomGroupName()

    console.log(roomGroup[n.bind.roomName])
    return false;
}

var socket
window.onload = function() {
    d.autoLoadId()

    // Create a new WebSocket.
    //var socket = new WebSocket('ws://echo.websocket.org');
    //var socket = new WebSocket('localhost:3000');
    //var socket = new WebSocket('ws://localhost:3000')
    //var socket = io('http://localhost:3000')
    //var socket = new WebSocket()

    socket = io.connect();


    // Handle any errors that occur.
    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };

    socket.on("connect", () => {
        socketStatus.innerHTML = 'Connected '+socket.id
        socketStatus.className = 'open';
    });
    socket.on("disconnect", (reason) => {
        socketStatus.className = 'closed';
    });
    var showMember = (users) => {
        userList.innerHTML = ''
        users.map(e => {
            var id = 'user-' + e.name.replace(/\s/g, '-')
            if (e.name !== userName.value)
                userList.innerHTML += '<li id="{{id}}"><a href="#" onclick=setRoomId(this) oncontextmenu=setMember(event) data-id="{{socket-id}}">{{name}}</a></li>'.replace('{{name}}', e.name).replace('{{id}}', id).replace('{{socket-id}}', e.id)
        })
    }
    socket.on('/websocket/init', (received) => {
        //userName.innerHTML = JSON.stringify(received)
        userName.value = received.name
        userName.setAttribute('data-old-name',received.name)
        userName.setAttribute('data-id',received.id)
        showMember(received.users)

    })

    socket.on('/websocket/join', (received) => {
        showMember(received.users)
    })

    socket.on('/websocket/userleft', (received) => {
        var one = userList.querySelector('#user-' + received.name.replace(/\s/g, '-'))
        one.remove()
    })

    socket.on('/websocket/room', (sms) => {
        console.log(sms)
        if (!rooms[sms.from]) rooms[sms.from] = []

        //roomId.innerHTML = sms.from
        var me = userList.querySelector('a[data-id="'+sms.from+'"]')
        roomId.innerHTML = me.innerText
        roomId.setAttribute('data-id',sms.from)

        rooms[sms.from].push({
            data: sms.data,
            type: 'received'
        })

        showRoomSMS(sms.from)
    })
    sendToRoom.onclick = () => {
        var message = messageField.value;
        var id = roomId.dataset.id ;// .innerText.trim()

        if (!rooms[id]) rooms[id] = []

        rooms[id].push({
            data: message,
            type: 'send'
        })

        showRoomSMS(id)

        messageField.value = ''

        socket.emit('/websocket/room', {
            data: message,
            id: id
        });
        //alert('ok')
    }

    socket.on('/websocket/roomgroup', (received) => {
        initRoomGroup(received.name)
        //roomId.innerHTML = received.from

        roomGroup[received.name].data.push({
            data: received.data,
            from:received.from,
            type: 'received'
        })
        roomGroup[received.name].members = received.members

        showRoomGroupName()
        roomId.dataset.idList = received.members.join(',')

        showRoomGroupSMS(received.members.join(','),received.name)
    })
    sendToRoomGroup.onclick = () => {
        var message = messageField.value;
        messageField.value = ''

        initRoomGroup(roomId.innerText)

        roomGroup[roomId.innerText].data.push({
            data: message,
            type: 'send'
        })


        var members = roomId.dataset.idList.split(',')
        socket.emit('/websocket/roomgroup', {data:message,name:roomId.innerText,members:members});
        //alert('ok')
        showRoomGroupSMS(roomGroup[roomId.innerText].members.join(','),roomId.innerText)
    }
    socket.on('/websocket/message', (message) => {
        // messagesList.innerHTML += '<li class="received"><span>Received:</span> <a onclick=setRoomId(this) oncontextmenu=setRoomGroup(this)>' + message.id + '</a> ' +
        //     message.data + '</li>';
        messagesList.innerHTML += '<li class="received"><span>Received:</span> ' +
            message.data + '</li>';
    })

    // Show a disconnected message when the WebSocket is closed.
    socket.onclose = function(event) {
        socketStatus.innerHTML = 'Disconnected from WebSocket.';
        socketStatus.className = 'closed';
    };


    // Send a message when the form is submitted.
    messageForm.onsubmit = function(e) {
        e.preventDefault();

        // Retrieve the message from the textarea.
        var message = messageField.value;

        // Send the message through the WebSocket.
        socket.emit('/websocket/message', {
            data: message,
            id: socket.id
        });

        // Add the message to the messages list.
        messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + message +
            '</li>';

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

    socket.on('/websocket/changename',(received)=>{
      //'<li id="{{id}}"><a href="#">{{name}}</a></li>'.replace('{{name}}', e).replace('{{id}}', id)
      var {oldName,newName} = received
      var oldId = '#user-' + oldName.replace(/\s/g, '-')
      var newId = '#user-' + newName.replace(/\s/g, '-')
      var one = userList.querySelector(oldId)
      one.id = newId
      one.querySelector('a').innerHTML = newName
    })
    userForm.onsubmit = () =>{
      socket.emit('/websocket/changename', {oldName:userName.dataset.oldName,newName:userName.value});
      //alert('submit')
      //console.log('/websocket/changename',{oldName:userName.dataset.oldName,newName:userName.value})
      return false
    }
};