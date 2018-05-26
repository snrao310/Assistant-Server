let id_generator = 0;

export class Session {

    public lastUserMessage: string;
    public lastServerMessage: string;

    private _id: string;
    private _socket;
    private _userName: string;

    constructor(session: any) {
        id_generator++;
        this._id = id_generator.toString();
        this._socket = session.socket;
        this._userName = session.userName;
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

    set socket(value) {
        this._socket = value;
    }
}