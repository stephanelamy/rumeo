let me;
let game;

function setup() {//fonction speciale qui s'active une fois au debut
  createCanvas(windowWidth, windowHeight);
  me = new HumanPlayer();
  game = new Game([me]);
}

function draw() {//fonction speciale qui s'active 60 fois par seconde (ou moins si le programme est trop lourd)
  background(100);
  me.draw();
  chat();
}

function mousePressed(){//fonction speciale qui s'active quand on click
  let click = me.mouseWasPressed();
  if (click == "pick_tile"){
    game.pickOneTile(me);
}

function mouseReleased(){//fonction speciale qui s'active quand on relache
  me.drop();
}

function keyPressed(){
  clavierchat();
}

function mouseWheel(MouseEvent) {//bouge le chat
  chatscroll(MouseEvent);
}

function mouseWheel(event) {//bouge le chat
  chatscroll(event);
}

