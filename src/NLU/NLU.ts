import {CloudTextToSpeechConverter} from "../SpeechConverstion/CloudTextToSpeechConverter";

var apiai = require('apiai');

var app = apiai('76b7790534dc47b99048c3238d7fe994');

export class NLU {

    public static async getNLUResponse(text,socket){
        var request = await app.textRequest(text, {
            sessionId: 'dummySessionId'
        });

         request.on('response', async function(response) {
            console.log(response);
             let speech: any = await CloudTextToSpeechConverter.getSpeech(response.result.fulfillment.speech);
             socket.emit('serverMessage', {message: speech});
         });

        request.on('error', function(error) {
            console.log(error);
        });

        request.end();
    }
}