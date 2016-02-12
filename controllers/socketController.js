/**
 * Created by jbeckton on 2/11/16.
 */
module.exports = function (socket) {

    socket.emit('init', {
        message: 'Welcome to the Api socket!'

    });

    socket.on('user:join', function(data, fn){

        socket.broadcast.emit('user:join', {
            user: data.user,
            room: data.room
        });

        fn(data.user + ' JOINED the room named ' + data.room );

    });

    socket.on('user:leave', function(data, fn){

        socket.broadcast.emit('user:leave', {
            user: data.user,
            room: data.room
        });

        fn(data.user + ' LEFT the room named ' + data.room );

    });

    socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
            user: data.user,
            message: data.message,
            room: data.room
        });



    });

}