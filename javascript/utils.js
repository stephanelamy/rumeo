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

function compareTiles777(a, b) {
  return 4*b.number + b.color - (4*a.number + a.color);
}

function compareTiles678(a, b) {
  return 13*b.color + b.number - (13*a.color + a.number);
}
