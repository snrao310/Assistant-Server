import {Logger} from "../Utils/Logger";
import * as http from "http";
import {RestServices} from "./RestServices";


export class ClientConnection{

    public static createSocket(){
        try{
            let server: http.Server = RestServices.server;
            let io = require('socket.io').listen(server);
            io.sockets.on('connection', function (socket) {
                socket.on('userMessage', function (data) {
                    Logger.debug(JSON.stringify(data.body.message));
                    socket.emit('serverMessage', {msg: 'AWESOME'});
                });

                socket.on('anotherEvent', function (data) {
                    Logger.debug(JSON.stringify(data));
                    socket.emit('received', {msg: 'EVEN MORE AWESOME'});
                });

                socket.on('disconnect', function (data) {
                    Logger.info("Disconnected");
                });
            });
        }
        catch (err) {
            Logger.error('Error while initializing socket');
            throw err;
        }
    }
}