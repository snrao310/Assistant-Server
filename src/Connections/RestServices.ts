import * as http from "http";
import {Logger} from "../Utils/Logger";
let express = require('express');
let app = express();
// let bodyParser= require('body-parser');


export class RestServices{

    public static server: http.Server;

    public static createServer(){
        try{
            this.server = app.listen(3000, () => {
                console.log("Listening now")
            });
            this.setupEndpoints();
        }
        catch (err) {
            Logger.error('Error while creating server');
            throw err;
        }
    }

    private static setupEndpoints(){
        app.use(express.json());
        app.post('/ping', (req,res) =>{
            Logger.debug(JSON.stringify(req.body));
            res.send("Ping response");
            Logger.info("Sent response");
        })
    }
}