const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'));
let http = require('http').Server(app)
const io = require('socket.io')(http) 


io.on('connection', function (socket) {
    console.log('a user connected')
    let userID = '';
    socket.on('join', function (userName) {
        userID = userName;
        io.emit('sys', userID + '已加入房间');
        console.log(userID + '加入了');
    });
    socket.on('message', function (userName,msg){
        io.emit('msg', userName,msg)
    })
})

http.listen(3000, () => console.log('Example app listening on port 3000!'))
