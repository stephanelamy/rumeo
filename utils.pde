// returns a random number between min and max (both included)
int randomInteger(int min, int max) {
  return (int)Math.floor(Math.random() * (max - min + 1) ) + min;
}

// checks if a point(target) overlaps with a rectangle
boolean overlap(int rectX, int rectY, int  rectW, int rectH, int targetX, int targetY){
  return (rectX <= targetX && targetX <= rectX+rectW && 
          rectY <= targetY && targetY <= rectY+rectH);
}

// checks if a point(target) overlaps with a box(rectangle), variant
boolean overlap2(int[] box, int[] point){
  int rectX = box[0];
  int rectY = box[1];
  int rectW = box[2];
  int rectH = box[3];
  int targetX = point[0];
  int targetY = point[1];
  return overlap(rectX, rectY, rectW, rectH, targetX, targetY);
}

int computeSize(int nbColumns) {
  return int(Math.min( 0.8* width / (Math.max(16, nbColumns)), 0.85*height / 6 * 2/3 ));
}
