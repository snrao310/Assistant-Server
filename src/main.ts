import * as http from "http";
let express = require('express');
let app = express();
// let bodyParser= require('body-parser');
let server: http.Server = app.listen(3000, () => {
    console.log("Listening now")
})
app.use(express.json())
let io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.on('sendingData', function (data) {
        console.log(JSON.stringify(data));
        socket.emit('received', {msg: 'AWESOME'});
    });

    socket.on('anotherEvent', function (data) {
        console.log(JSON.stringify(data));
        socket.emit('received', {msg: 'EVEN MORE AWESOME'});
    });
});

app.post('/', (req,res) =>{
    console.log(JSON.stringify(req.body));
    if(req.body.hasOwnProperty('key') && req.body.key== "Hanuman")
        res.send("Jai Shri Ram");
    console.log("You said: \""+req.body.speech + "\"");
})



module.exports = app;
