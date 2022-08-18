(function(n) {
    window.socket = io.connect();

    var eventDefaults = ['connect', 'disconnect', 'disconnecting','onerror']
        //socket
    socket.onEmit = (eventName, callback) => {
        socket.on(eventName, (data) => {
            var r = callback(data)
                //answer
            if (r != undefined && r.broadcast) {
                delete r.broadcast
                socket.broadcast.emit(eventName, r)
                return;
            }
            if (r != undefined) {
                socket.emit(eventName, r)
            }
        })
    }
    socket.init = (ctrName, client) => {
        // settup all function client 
        for (var key in client) {
            if (eventDefaults.indexOf(key) != -1) {
                socket.onEmit(key, client[key])
                continue;
            }
            var handler = client[key];
            var urlRoute = ctrName + key;
            socket.onEmit(urlRoute, handler)
                //console.log('%s', urlRoute);
        }
    }

})(window.n);