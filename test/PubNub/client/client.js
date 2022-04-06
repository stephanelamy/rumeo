pubnub = new PubNub({
        publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
        subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
        uuid: "testclient"
    })

let n = 0;
let list = new Set();
list.add('zero');

function publishMessage() {
        n++;
        console.log(list);
        console.log(JSON.stringify(...list.values()));
        var msg = {
            channel : "test",
            message: "click " + n.toString(),
            list: JSON.stringify(...list.values()) 
        }
        try {
            const result = pubnub.publish(msg);
            console.log('result', result);
        } catch(error) {
            console.log('error', error);
        }
    }
  

