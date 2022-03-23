let tile;

function setup() {
  createCanvas(windowWidth, windowHeight);
  tile = new drawnTile(1,1)
}

function draw() {
  background(100);
  tile.moveCoord(100,100);
  tile.drawTile();
}