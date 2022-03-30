class TableGrid extends Grid{
  constructor(rows, cols, tileArray){
    super(rows,cols,tileArray);
    this.color = [0,100,0];
    this.marginCoeff.row = 0.3;
  } 

  cornerX(){
    return width/2 - this.cols*this.size/2 -  this.margin('right') -  this.margin('left');
  }

  cornerY(){
  return 40;
  }

  // For the moment I don't consider jokers
  // hand is an array of tile numbers
  // might be better to put these functions in Grid, since also useful for the rack
  
  parse(){
    let isCompletable = true;
    let isValid = true;
    for (let row=0; row < this.rows; row++){
      let currentHand = [];
      for (let col=0; col < this.cols; col++){
        if (this.place[row][col] == 'empty' || col == this.cols - 1){
          if (currentHand.length > 0){
            isCompletable = isCompletable && this.isPreCombination(currentHand);
            isValid = isValid && this.isCombination(currentHand);
            currentHand = [];
          }
        } else {
          currentHand.push(this.place[row][col]);
        }
      }
    }
    return [isCompletable, isValid];
  }

  isPreSerie(hand) {
      //  Tiles with the same number, and distinct colors
      const colorSet = new Set();
      const numberSet = new Set();
      for (const index of hand) {
      colorSet.add(this.tile[index].color);
      numberSet.add(this.tile[index].number);
      }
      return numberSet.size == 1 && colorSet.size == hand.length;
  }

  isSerie(hand) {
    // 3 or 4 tiles with the same number, and distinct colors
    return hand.length > 2 && this.isPreSerie(hand);
  }
  
  isPreSequence(hand) {
    // all same color, with consecutive numbers
    const colorSet = new Set();
    const numberArray = [];
    for (const index of hand) {
      colorSet.add(this.tile[index].color);
      numberArray.push(this.tile[index].number);
    }
    return colorSet.size == 1 && hand.length == Math.max(...numberArray) - Math.min(...numberArray) + 1;
  }
  
  isSequence(hand) {
  //   At least 3 tiles, all same color, with consecutive numbers
  return hand.length > 2 && this.isPreSequence(hand);
  }
  
  isPreCombination(hand) {
    return this.isPreSerie(hand) || this.isPreSequence(hand);
  }

  isCombination(hand) {
    return this.isSerie(hand) || this.isSequence(hand);
  }
}
  