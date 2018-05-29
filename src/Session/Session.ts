let id_generator = 0;

export class Session {

    public lastUserMessage: string;
    public lastServerMessage: string;

    private _id: string;
    private _socket;
    private _userName: string;
    private _intent: string;
    private _entities: string;

    constructor(session: any) {
        id_generator++;
        this._id = id_generator.toString();
        this._socket = session.socket;
        this._userName = session.userName;
        this._intent = session.intent;
        this._entities = session.intent;
    }

    public hasOwnProperty(property: string){
        if(this[property]!=undefined){
            return true;
        }
        return false;
    }

    get id() {
        return this._id;
    }

    get socket() {
        return this._socket;
    }

    get userName(): string {
        return this._userName;
    }

    get intent(): string {
        return this._intent;
    }

    get entities(): string {
        return this._entities;
    }

    set intent(value) {
        this._intent = value;
    }

    set socket(value) {
        this._socket = value;
    }

    set entities(value) {
        this._entities = value;
    }
}