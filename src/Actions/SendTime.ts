import {Session} from "../Session/Session";
import {isNullOrUndefined} from "util";
import {Logger} from "../Utils/Logger";
let dateFormat = require('dateformat');
let geoTz = require('geo-tz');
let offsets = require('timezone-name-offsets');
let NodeGeocoder = require('node-geocoder');

let secretsPath: string = process.env.ASSISTANT_SECRETS;
let mapsPlatformSecret: string = require(secretsPath)["maps-platform-Secret"];
let options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: mapsPlatformSecret,
    formatter: null
};
let geocoder = NodeGeocoder(options);

export class SendTime{

    public static async execute(session: Session){
        let address = this.getAddress(session);
        if(address === ''){
            let response: any = {textResponse: dateFormat(new Date(), 'h:MM TT')};
            return response;
        }
        else{
            try{
                let geoCode: any = await geocoder.geocode(address);
                let location: any = geoCode[0];
                let timeZone = geoTz(location.latitude,location.longitude);
                let now = new Date();
                let utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                let newTime = new Date(utc + (60000*offsets[timeZone]));
                let response: any = {textResponse: dateFormat(newTime, 'h:MM TT')};
                return response;
            }
            catch(err){
                Logger.error('Error while resolving time for remote location');
                throw err;
            }
        }
    }

    private static getAddress(session){
        let country: string = session.entities['geo-country'];
        let state: string = session.entities['geo-state'];
        if(isNullOrUndefined(state) || state.length==0) {
            state = session.entities['geo-state-us'];
        }
        let city: string = session.entities['geo-city'];
        let address: string = (!isNullOrUndefined(city) && city.length!=0)?city:'';
        if(!isNullOrUndefined(state) && state.length!=0) address = address +', '+state;
        if(!isNullOrUndefined(country) && country.length!=0) address = address + ', '+country;
        return address;
    }
}