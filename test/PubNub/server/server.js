pubnub = new PubNub({
  publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
  subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
  uuid: "testserver"
})
    
pubnub.addListener({
  message: (msg) => {
      console.log('message', msg.message);
      console.log('channel', msg.channel);
      let text = msg.message;
      console.log(msg.list);
      // let list = new Set(JSON.parse(msg.list));
      // console.log(list);
      // for (item of msg.list) {
      //   test += item;
      // }
      document.getElementById("demo").innerHTML = text;
  }
})

pubnub.subscribe({
  channels: ['test']
});

// console.log(result)

