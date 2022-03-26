// returns a random number between min and max (both included)
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// checks if a point(target) overlaps with a rectangle
function overlap(rectX, rectY, rectW, rectH, targetX, targetY){
  return (rectX <= targetX &&
          targetX <= rectX+rectW && 
          rectY <= targetY &&
         targetY <= rectY+rectH);
}

// checks if 2 rectangles overlap
function rectOverlap(x,y,w,h,x2,y2,w2,h2){
  let answer = overlap(x,y,w,h,x2,y2) ||//see if one of rect 2 corners is overlapping rect 1
  overlap(x,y,w,h,x2+w2,y2)||
  overlap(x,y,w,h,x2,y2+h2)||
  overlap(x,y,w,h,x2+w2,y2+h2)||
  overlap(x2,y2,w2,h2,x,y)   ||//see if one of rect 1 corners is overlapping rect 2
  overlap(x2,y2,w2,h2,x+w,y)||
  overlap(x2,y2,w2,h2,x,y+h)||
  overlap(x2,y2,w2,h2,x+w,y+h);
  return answer;
}

function compareTiles777(a, b) {
  return 4*b.number + b.color - (4*a.number + a.color);
}
