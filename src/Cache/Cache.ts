import {Session} from "../Session/Session";

export class Cache{
    public static sessionsTable: any={};

    public static getSession(query: any){
        if(query.hasOwnProperty('id')){
            return this.sessionsTable[query.id];
        }
        else{
            for(let id in this.sessionsTable){
                let session:Session = this.sessionsTable[id];
                let match: number = 0;
                for(let field in query){
                    if(session.hasOwnProperty(field) && session[field]===query[field]){
                        match++;
                    }
                    else{
                        break;
                    }
                }
                if(match==Object.keys(query).length){
                    return session;
                }
            }
            return null;
        }
    }

    public static insertSession(session: Session){
        if(session.hasOwnProperty('id') && session.hasOwnProperty('userName')){
            if(!this.sessionsTable.hasOwnProperty(session.id)){
                this.sessionsTable[session.id] = session;
            }
        }
    }
}