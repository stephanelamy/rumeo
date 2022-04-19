class BotPlayer extends Player{
  constructor(name, game) { // name has the form 'bot_1', 'bot_2'...
    super();
    this.game = game;
    this.client = new Client(this, name);
  }

  move() {
    console.log('bot moving');
    this.client.pickTile();

    // if (this.rack.isEmpty()) {
    //   this.client.pickTile();
    // } else {
    //   this.rack.sort(compareTiles777());
    //   index = this.rack.place[0][0];
    //   // put tile index on table
    // }
  }

  
}