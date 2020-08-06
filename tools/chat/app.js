var express = require('express')
const socketio = require('socket.io');
const http = require('http');
const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 8080

const path = require('path');

app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => res.send('Please access by /public/index.html'))

const botName = 'Chat Bot';

function mainApp() {
    io.on('connection', (socket) => {
        console.log("Have a new Connection ...");

        socket.on('joinRoom', ({ username, room }) => {
            console.log("UserID:", socket.id);
            const user = userJoin(socket.id, username, room);
            socket.join(user.room);

            socket.emit("message", formatMessage(botName, `Welcome to Chat Room ${user.room}`));

            // Broadcast when a user connects
            socket.broadcast
                .to(user.room)
                .emit(
                    'message',
                    formatMessage(botName, `${user.username} has joined the chat`)
                );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        });

        socket.on('chatMessage', msg => {
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        });

        socket.on('disconnect', () => {
            console.log("Disconnect ...");
            const user = userLeave(socket.id);
    
            if (user) {
                io.to(user.room).emit(
                    'message',
                    formatMessage(botName, `${user.username} has left the chat`)
                );
    
                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });
    });
}

mainApp();

server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))