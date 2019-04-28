var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var fs      = require("fs");
var util    = require('util');

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

io.sockets.on('connection',function(socket){
    
    var count =0; //Variables to count each sokcet

    console.log("Device connected to the server");

    //Python Clients handle request
    socket.on('python-client-connected',function(){
        console.log('Python client connected!\nID: '+socket.id);

        //Timer task send to Python Thread
        var myTimer = setInterval(function(){
            console.log("\n\n"+count+" Times");
            console.log("Sending to socket ID: "+ socket.id);
            console.log("Sending Infomation to stream...");
            try {
                if(myPosition!=null)
                console.log("Sending: "+JSON.stringify(myPosition));
                socket.emit('server-send-vehicle-position',myPosition);   
                console.log('Send Successfully!\n\n');
                count++;
            } catch (error) {
                console.log(error);
            }
        },10000);
        
        //Receive From Python
        socket.on('python-send-vehicle-position',function(position){
            myPosition = position;
            
            console.log("\n\nPython Client Send Data");
            console.log("ID: "+socket.id);
            console.log(JSON.stringify(myPosition)+"\n\n");
            socket.emit('server-receive-done-python');
        });

        //Handle the disconnect event
        socket.on('disconnect',function(){
            console.log("\n\nID: "+socket.id);
            console.log("Got Disconnect");
            console.log("Stop timer Thread of this socket...\n\n");
            clearInterval(myTimer);
        });
    });

    socket.on('android-client-connected',function(hi_message){
        console.log('Android client Connected!\nID: +socket.id');
        console.log(hi_message);
    });
});

