class Tile{
  int colour;
  int number;
  int x,y;
  int row,col;
  Grid grid;
  int size;
  PImage imagePNG;
  boolean moving;
  int no; // for sorting purpose
  
  Tile(int colorD, int numberD) {
    colour = colorD;//1-4, (0 pour joker)
    number = numberD;//1-13 (0 pour joker)
    x = 0;
    y = 0;
    row = 0; // 1-n
    col = 0; // calcul
    size = 0;//his width    height=width*1.5
    imagePNG = loadImage(fileName()); // original image
    moving = false;
    no = NONE;
  }

  String fileName(){
    return "png/tile_"+number+"_"+colour+".png";
  }

  void setSize(int cols){
    size = computeSize(cols);
  }
  
  void draw() {
    image(imagePNG, x, y, size, size*3/2);
  }

  int[] center() {
    int[] data = {int(x + size/2), int(y + size*3/4)};
    return data;
  }

  int[] rectangle() {
    int[] data = {x, y, size, size*3/2};
    return data;
  }

  int sort777() {
    return 4*number + colour;
  }
  
  int sort678() {
    return number + 13*colour;
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
