import {Session} from "../Session/Session";
import {ClientConnection} from "../Connections/ClientConnection";
var alarm = require('alarm');

export class SetAlarm{

    public static async execute(session: Session){
        let time: string = session.entities['date-time'];
        let recurrence: string = session.entities['recurrence'];
        let parts: any[] = time.split(':');
        let date = new Date();
        date.setHours(parts[0],parts[1],0);
        let now = new Date();
        if(date<now) {
            date.setDate(date.getDate() + 1);
        }

        let clientJobs: any = {
            task: "SetAlarm",
            time: date,
            recurrence: recurrence
        };
        let response: any = {textResponse: "Done", clientJobs: clientJobs};
        alarm(date, function() {
            console.log('Hello, world! at '+date);
            //play alarm here
        });
        return 'Done'
    }

}