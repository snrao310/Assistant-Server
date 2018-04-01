import * as http from "http";

let express = require('express');
let app = express();
// let bodyParser= require('body-parser');
app.use(express.json())

app.post('/', (req,res) =>{
    console.log(JSON.stringify(req.body));
    if(req.body.hasOwnProperty('key') && req.body.key== "Hanuman")
        res.send("Jai Shri Ram");
})

let server: http.Server = app.listen(3000, () => {
    console.log("Listening now")
})
module.exports = app;
