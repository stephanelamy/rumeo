class Tile{
  int thiscolor;
  int number;
  int x,y;
  int row,col;
  Grid grid;
  float size;
  PImage image;
  boolean moving;
  
  Tile(int colorD, int numberD) {
    thiscolor = colorD;//1-4, ('J' pour joker)
    number = numberD;//1-13 ('J' pour joker)
    x = 0;
    y = 0;
    row = 0; // 1-n
    col = 0; // calcul
    size = 0;//his width    height=width/2*3
    image = loadImage(fileName()); // original image
    moving = false;
  }

  float computeSize(int nbColumns) {
    return Math.min( 0.8* width / (Math.max(16, nbColumns)),
                     0.85*height / 6 * 2/3 );
  }

  String fileName(){
    return "tiles/png/tile_"+number+"_"+thiscolor+".png";
  }

  void setSize(int cols){
    //size = Tile.computeSize(cols);
  }
  
  void draw() {
    image(image, x, y, size, size*3/2);
  }

  IntList center() {
    IntList data = new IntList();data.append(int(x + size/2));data.append(int(y + size*3/4));
    return data;
  }

  IntList rectangle() {
    IntList data = new IntList();data.append(x);data.append(y);data.append(int(size));data.append(int(size*3/2));
    return data;
  }

  void drawManualy(){
    //manual drawing
    float w = size;
    float h = size/2*3;
    push();
    fill(255,255,255);
    strokeWeight(2);
    rect(x,y,w,h);
    
    fill(255);
    textSize(size/2);
    float numberX = x+(w/2);//the middle of the tile
    float numberY = y+(h/2);
    textAlign(CENTER, CENTER);
    text(number,numberX,numberY); 
    pop();
    }
}
