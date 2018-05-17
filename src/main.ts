import {ClientConnection} from "./Connections/ClientConnection";
import {RestServices} from "./Connections/RestServices";
import {Logger} from "./Utils/Logger";

try{
    RestServices.createServer();
    ClientConnection.createSocket();
}
catch (err) {
    Logger.error(err);
}