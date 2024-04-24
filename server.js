const fs = require('fs');
const cors = require('cors');
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const app = express();
// Middleware to parse JSON bodies
app.use(express.json()); 
// Allow requests from all origins
app.use(cors());
//create server 
const server = http.createServer(app);

// port
const port = process.env.PORT || 3000;



// create the api

app.get('/api/platform', (req, res) => {

    fs.readFile('coordinate.txt', 'utf8', (err, data) => {
        if (err) throw err;
        res.status(200).json(data);
    });

});

app.post('/api/platform', (req, res) => {
    const data=  req.body.coordinate ;
    fs.writeFile('coordinate.txt', data, (err) => {
        if (err){
            res.status(200).json("added successfully");
        }else{
            res.status(400).json("ERROR : "+err);
        }
    });

});


//listening to the port
server.listen(port,()=>{
    console.log("port connected at "+port);
})