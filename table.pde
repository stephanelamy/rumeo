class TableGrid extends Grid{
  TableGrid(int rows, int cols,ArrayList<Tile> tileArray){
    super(rows,cols,tileArray);
    thiscolor = color(0,100,0);
    //marginCoeff.row = 0.3;
  } 

  int cornerX(){
    return int(width/2 - cols*size/2 -  margin("right") -  margin("left"));
  }

  int cornerY(){
  return 40;
  }

  // For the moment I don't consider jokers
  // hand is an array of tile numbers
  
  StringList parse(){
    boolean isCompletable = true;
    boolean isValid = true;
    for (int row=0; row < rows; row++){
      IntList currentHand = new IntList();
      for (int col=0; col < cols; col++){
        if (place[row][col] == -1 || col == cols - 1){
          if (currentHand.size() > 0){
            isCompletable = isCompletable && isPreCombination(currentHand);
            isValid = isValid && isCombination(currentHand);
            currentHand.clear();
          }
        } else {
          currentHand.push(place[row][col]);
        }
      }
    }
    StringList data = new StringList();data.append(str(isCompletable));data.append(str(isValid));
    return data;

  }

  /*
  void isPreSerie(hand) {
      //  Tiles with the same number, and distinct colors
      const colorSet = new Set();
      const numberSet = new Set();
      for (const index of hand) {
      colorSet.add(this.tile[index].color);
      numberSet.add(this.tile[index].number);
      }
      return numberSet.size == 1 && colorSet.size == hand.length;
  }

  void isSerie(hand) {
    // 3 or 4 tiles with the same number, and distinct colors
    return hand.length > 2 && this.isPreSerie(hand);
  }
  
  void isPreSequence(hand) {
    // all same color, with consecutive numbers
    const colorSet = new Set();
    const numberArray = [];
    for (const index of hand) {
      colorSet.add(this.tile[index].color);
      numberArray.push(this.tile[index].number);
    }
    return colorSet.size == 1 && hand.length == Math.max(...numberArray) - Math.min(...numberArray) + 1;
  }
  
  void isSequence(hand) {
  //   At least 3 tiles, all same color, with consecutive numbers
  return hand.length > 2 && this.isPreSequence(hand);
  }
  
  void isPreCombination(hand) {
    return this.isPreSerie(hand) || this.isPreSequence(hand);
  }

  void isCombination(hand) {
    return this.isSerie(hand) || this.isSequence(hand);
  }
  */
  
  boolean isPreSerie(IntList hand) {
  
    return true;
  }
  
  boolean isSerie(IntList hand) {
    return true;
  }
  
  boolean isPresequence(IntList hand) {
    return true;
  }
  
  boolean isSequence(IntList hand) {
  return true;
  }
  
  boolean isPreCombination(IntList hand) {
    return true;
  }
  
  boolean isCombination(IntList hand){
    return true;
  }
}
  
