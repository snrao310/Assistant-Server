import {Session} from "../Session/Session";
import {isNullOrUndefined} from "util";
let dateFormat = require('dateformat');

export class SetAlarm{

    public static async execute(session: Session){
        let time: string = session.entities['date-time'];
        let originalTime: string = session.entities['date-time.original'];
        let recurrence: string = session.entities['recurrence'];

        if(isNullOrUndefined(time) || time===""){
            return {textResponse: 'What time?'};
        }

        let parts: any[] = time.split(':');
        let date = new Date();
        date.setHours(parts[0],parts[1],0);
        let now = new Date();

        if(now.getHours() >= 12 && date.getHours()<=12 && (isNullOrUndefined(originalTime) || originalTime.indexOf(' am')==-1)){
            let tempDate = new Date(date);
            parts[0] = ((parseInt(parts[0])+12)%24).toString();
            tempDate.setHours(parts[0]);
            if(tempDate>now)
                date = tempDate;
        }


        if(date<now) {
            date.setDate(date.getDate() + 1);
        }

        let clientJobs: any = {
            task: "SetAlarm",
            time: date,
            recurrence: recurrence
        };
        let response: any = {textResponse: "Done. Alarm set for "+dateFormat(date, 'h:MM TT'), clientJobs: clientJobs};
        return response;
        // alarm(date, function() {
        //     console.log('Hello, world! at '+date);
        //     //play alarm here
        // });
        // return 'Done'
    }

}