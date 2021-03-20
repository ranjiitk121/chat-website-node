const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const wordFilter = require('bad-words');
const {generateMessage,generatLocationMessage} =require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.json());

const publicDirectoryPath = path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));



const PORT = process.env.PORT || 3000;
let count =0;

io.on('connection',(socket)=>{

  
    socket.emit('countUpdated',count);
    socket.emit('message',generateMessage('Welcome'));
    socket.broadcast.emit('message', generateMessage("A new User has joined"));


    socket.on('increment', ()=>{
        count++;
        // socket.emit('countUpdated',count); // this one emits for 
        //specific connection
        io.emit('countUpdated',count); // emits for all connections
    });

    // for joining room
    socket.on('join', ({username,room})=>{
        socket.join(room);
        //io.to.emit emits event to everybody in a room
        //io.to.emit similar to brodcast but just for a specific room
    });

    socket.on('sendMessage', (message, callback)=>{
        const messageFilter = new wordFilter();
        if(messageFilter.isProfane(message)){
            return callback({error:'Profanity is not allowd'});
        }  
        io.emit('message',generateMessage(message));
        callback();
    });
    socket.on('disconnect', ()=>{
        io.emit('message', 'USER HAS LEF THE CHAT')
    });

    socket.on('sendLocation', (location, callback)=>{
        io.emit('locationMessage', generatLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitute}`));
        callback();
    });

});



server.listen(PORT, ()=>{
    console.log('server is running on port '+PORT);
});