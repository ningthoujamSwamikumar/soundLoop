var stompClient = null;

function connect(){
    authClient.tokenManager.get('accessToken')
    .then(accessToken=>{
        if(accessToken){
            var socket = new SockJS('/looping');
            stompClient = Stomp.over(socket);
            stompClient.connect({"X-Authorization": "Bearer " + accessToken.accessToken},
            frame => {
                console.log('Connected: ' + frame);
                stompClient.subsribe('/topic/loops', message => {
                    console.log(loopEvent);
                    var loopEvent = JSON.parse(message.body);
                    console.log(loopEvent);
                    var button = eval(loopEvent.loopId);
                    if(button.state !== loopEvent.value){
                        button.state = loopEvent.value;
                        if(loopEvent.value === true){
                            button.player.restart();
                        }else{
                            button.player.stop();
                        }
                    }
                });
            });
        }else{
            console.log("token expired");
        }
    })
}

function sendEvent(loopId, value){
    if(stompClient != null){
        stompClient.send("/topic/loops", {}, JSON.stringify({'loopId': loopId, 'value':value}));
    }
}

function disconnect(){
    if(stompClient !== null){
        stompClient.disconnect();
        stompClient = null;
    }
    console.log("Disconnected");
}