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


//Variable for Android CLient
var ElekPosition;
ElekPosition={"Latitude":10.896868,"Longitude":106.801376};

//Variable for true position
var myPosition; //JSONObject for receiving information

var count =0;

io.sockets.on('connection',function(socket){
    console.log("Device connected to the server");

    //Receive From Python
    socket.on('python-send-vehicle-position',function(position){
        myPosition = position;
        
        console.log("Python Client Detected: ");
        console.log(myPosition);
        socket.emit('server-receive-done-python');
    });

    //Timer task send to Android
    var myTimer = setInterval(function(){
        console.log("\n\n"+count+" Times");
        console.log("Sending Infomation to stream...");
        try {
            if(myPosition!=null)
            console.log("Sending: "+JSON.stringify(myPosition));
            socket.emit('server-send-vehicle-position',myPosition);   
            console.log('Send Successfully!');
            count++;
        } catch (error) {
            console.log(error);
        }
    },10000);

    //Handle the disconnect event
    socket.on('disconnect',function(){
        console.log(socket+" Got Disconnect");
        clearInterval(myTimer);
    });
});

