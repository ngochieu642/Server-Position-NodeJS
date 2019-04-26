var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var fs      = require("fs");

server.listen(process.env.PORT || 11);
console.log("Server is running on port 11");

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

//Variable for getting position from Python Client
var myLongitude,myLatitude;

//Variable for Android CLient
var myPosition;
myPosition={"Latitude":10.896868,"Longitude":106.801376};

var count =0;

io.sockets.on('connection',function(socket){
    console.log("Device connected to the server");

    //Timer task
    var myTimer = setInterval(function(){
        console.log("\n\n"+count+" Times");
        console.log("Sending Infomation to stream...");
        try {
            if(myPosition!=null)
            socket.emit('server-send-vehicle-position',myPosition);   
            console.log('Send Successfully!');
            count++;
        } catch (error) {
            console.log(error);
        }
    },5000);
});

