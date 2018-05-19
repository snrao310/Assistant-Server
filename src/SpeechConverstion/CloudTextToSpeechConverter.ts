import {Logger} from "../Utils/Logger";
import {isNullOrUndefined} from "util";
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
const languageCode: string = "en-US";
const voiceName: string = "en-US-Wavenet-D";
const audioEncoding: string = "MP3";
const pitch: string = "-7.20";
const speakingRate: string = "1.34";


export class CloudTextToSpeechConverter {

    public static async getSpeech(text: string){

        // Construct the request
        const request = {
            input: {text: text},
            // Select the language and SSML Voice Gender (optional)
            //use languageCode en-US-Wavenet-D for wavenet voice
            //gender and voice options are all given here
            voice: {
                languageCode: languageCode,
                name: voiceName
            },
            // Select the type of audio encoding
            audioConfig: {
                audioEncoding: audioEncoding,
                pitch: pitch,
                speakingRate: speakingRate
            }
        };

        // Performs the Text-to-Speech request
        try{
            let response: any = await client.synthesizeSpeech(request);
            if(!isNullOrUndefined(response) && response.length!=0 && response[0].hasOwnProperty('audioContent')){
                return response[0].audioContent;
            }
            else{
                throw "Error while synthesizing speech: No response from cloud."
            }
        }
        catch (err){
            Logger.error('Error while synthesizing speech');
            throw err;
        }
    }
}