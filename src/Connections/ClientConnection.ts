import {Logger} from "../Utils/Logger";
import * as http from "http";
import {RestServices} from "./RestServices";
import {NLU} from "../NLU/NLU";
import {Session} from "../Session/Session";
import {Cache} from "../Cache/Cache";
import {isNullOrUndefined} from "util";
import {CloudTextToSpeechConverter} from "../SpeechConverstion/CloudTextToSpeechConverter";
let actionMapping: any = require('../../actionMapping.json');

export class ClientConnection{

    public static createSocket(){
        try{
            let server: http.Server = RestServices.server;
            let io = require('socket.io').listen(server);
            io.sockets.on('connection', function (socket) {
                socket.on('userMessage', async function (data) {
                    Logger.debug(Logger.getString(data));
                    if(data.hasOwnProperty('body') && data.body.hasOwnProperty('message') && data.body.hasOwnProperty('userName')){

                        let session: Session = Cache.getSession({userName: data.body.userName});
                        if(isNullOrUndefined(session)){
                            session = new Session({userName: data.body.userName});
                            Cache.insertSession(session);
                        }
                        session.socket = socket;
                        session.lastUserMessage = data.body.message;

                        //call the real stuff here (NLU, Action Mapping, Action Excecution, Response Creation)
                        try{
                            let NLUResponse: any = await NLU.getNLUResponse(session);
                            if(!NLUResponse.hasOwnProperty('result') || !NLUResponse.result.hasOwnProperty('metadata')){
                                Logger.error('No result in NLU response')
                                throw new Error('No result in NLU response');
                            }
                            if(NLUResponse.result.metadata.hasOwnProperty('intentName') && NLUResponse.result.metadata.intentName.split('.')[0]!='smalltalk'){
                                if(actionMapping.hasOwnProperty(NLUResponse.result.metadata.intentName)){
                                    session.intent = NLUResponse.result.metadata.intentName;
                                    session.entities = NLUResponse.result.parameters;
                                    let action = require('../Actions/'+actionMapping[session.intent])[actionMapping[session.intent]];
                                    let actionResponse : any = await action.execute(session);
                                    let textResponse: string = actionResponse.textResponse;
                                    let speechResponse: any = await CloudTextToSpeechConverter.getSpeech(textResponse);
                                    session.lastServerMessage = textResponse;
                                    actionResponse.speechResponse = speechResponse;
                                    ClientConnection.sendMessage(socket,actionResponse);
                                }
                            }
                            else if(NLUResponse.result.hasOwnProperty('action')){
                                let textResponse: string = NLUResponse.result.fulfillment.speech;
                                let speechResponse: any = await CloudTextToSpeechConverter.getSpeech(textResponse);
                                session.lastServerMessage = textResponse;
                                ClientConnection.sendMessage(socket,{textResponse: textResponse, speechResponse: speechResponse});
                            }
                        }
                        catch(err){
                            ClientConnection.sendMessage(socket,{textResponse: err});
                        }


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

    public static sendMessage(socket: any, message: any){
        socket.emit('serverMessage', message);
    }
}