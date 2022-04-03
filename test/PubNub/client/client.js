pubnub = new PubNub({
        publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
        subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
        uuid: "testclient"
    })

let n = 0;

function publishMessage() {
        n++;
        var message = {
            channel : "test",
            message: "click " + n.toString()
        }
        try {
            const result = pubnub.publish(message);
            console.log('result', result);
        } catch(error) {
            console.log('error', error);
        }
    }
  

