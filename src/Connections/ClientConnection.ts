import {Logger} from "../Utils/Logger";
import * as http from "http";
import {RestServices} from "./RestServices";
import {CloudTextToSpeechConverter} from "../SpeechConverstion/CloudTextToSpeechConverter";
import {NLU} from "../NLU/NLU";


export class ClientConnection{

    public static createSocket(){
        try{
            let server: http.Server = RestServices.server;
            let io = require('socket.io').listen(server);
            io.sockets.on('connection', function (socket) {
                socket.on('userMessage', async function (data) {
                    Logger.debug(ClientConnection.getString(data));
                    if(data.hasOwnProperty('body') && data.body.hasOwnProperty('message')){
                        let userMessage: string = data.body.message;

                        //call the real stuff here (NLU, Action Mapping, Action Excecution, Response Creation)
                        NLU.getNLUResponse(userMessage,socket);


                        // let speech: any = await CloudTextToSpeechConverter.getSpeech(NLUResponse.result.fulfillment.speech);
                        // socket.emit('serverMessage', {message: speech});
                    }
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

    private static getString(data: any){
        if(typeof data == "object"){
            return JSON.stringify(data);
        }
        return data;
    }
}