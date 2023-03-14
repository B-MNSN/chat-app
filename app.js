const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})



io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('newuser', (username) => {
        let newUser = username;
        console.log(`${newUser} connected`);

        socket.on('disconnect', () => {
            console.log(`${newUser} disconnected`);
            io.emit('disconnected', `${newUser} disconnected`);
        })
    })

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('typing', data => {
        socket.broadcast.emit('typing', { username: data.username });
    })

});

server.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on ${PORT}`);
})