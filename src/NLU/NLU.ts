import {Session} from "../Session/Session";
import {Logger} from "../Utils/Logger";

let secretsPath: string = process.env.ASSISTANT_SECRETS;
let apiaiSecret: string = require(secretsPath)["api.ai-Secret"];

var apiai = require('apiai-promise');
var app = apiai(apiaiSecret);

export class NLU {

    public static async getNLUResponse(session: Session) {
        try {
            let text = session.lastUserMessage;
            let response = await app.textRequest(text, {
                sessionId: session.id
            });

            Logger.debug(Logger.getString(response));
            return response;
        }
        catch (err) {
            Logger.error('Error getting NLU response');
            throw err;
        }
    }
}