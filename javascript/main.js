let ALWAYSMASTER = true; // true for developpement purpose
let AUTOSTART = false; // true for developpement purpose

let me;

function setup() {//fonction speciale qui s'active une fois au debut
  createCanvas(windowWidth, windowHeight);
  me = new HumanPlayer();
  if (AUTOSTART) { autostart(); }
}

function draw() {//fonction speciale qui s'active 60 fois par seconde (ou moins si le programme est trop lourd)
  me.draw();
}

function mousePressed(){//fonction speciale qui s'active quand on click
  me.mousePressed();
  // let click = me.mouseWasPressed();
  // if (click == "pick_tile"){
  //   game.pickOneTile(me);
  // }
}

function mouseReleased(){//fonction speciale qui s'active quand on relache
  me.mouseReleased();
}

function keyPressed(){
  me.keyPressed();
}

function mouseWheel(event) {
  me.mouseWheel(event);
}

function autostart() {
  me.status = 'playing';
  const channelList = [];
  channelList.push('player_' + UUID);
  channelList.push('bot_' + UUID);
  me.game = new Game(channelList);
}