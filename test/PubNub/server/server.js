pubnub = new PubNub({
        publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
        subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
        uuid: "testserver"
    })
    
pubnub.addListener({
    message: function(msg) {
        console.log(msg.message.line1);
        console.log(msg.message.line2);
        document.getElementById("demo").innerHTML = msg.message.line1;
    }
})

pubnub.subscribe({
        channels: ['test']
    });

