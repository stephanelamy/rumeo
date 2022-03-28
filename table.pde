class TableGrid extends Grid{
  TableGrid(int rows, int cols,ArrayList<Tile> tileArray){
    super(rows,cols,tileArray);
    colour = color(0,100,0);
    marginCoeff.put("row", 0.3);
  } 

  void setMaxs(){
    maxrows = 6;
    maxcols = 26;
  }

  int cornerX(){
    return int(width/2 - cols*size/2 -  margin("right") -  margin("left"));
  }

  int cornerY(){
  return 40;
  }

  // For the moment I don't consider jokers
  // hand is an array of tile numbers
  
  boolean[] parse(){
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
    boolean[] data = {isCompletable, isValid};
    return data;

  }

  // For the moment I don't consider jokers
  // hand is a list of tile numbers
  
  boolean isPreSerie(IntList hand) {
    //  Tiles with the same number, and distinct colors
    List<Integer> colorSet = new ArrayList<Integer>();
    Set<Integer> numberSet = new HashSet<Integer>();
    for (int index : hand) {
      colorSet.add(tile.get(index).colour);
      numberSet.add(tile.get(index).number);
    }
    return numberSet.size() == 1 && colorSet.size() == hand.size();
  }
  
  boolean isSerie(IntList hand) {
    // 3 or 4 tiles with the same number, and distinct colors
    return hand.size() > 2 && isPreSerie(hand);
  }
  
  boolean isPresequence(IntList hand) {
    // all same color, with consecutive numbers
    Set<Integer> colorSet = new HashSet<Integer>();
    List<Integer> numberSet = new ArrayList<Integer>();
    for (int index : hand) {
      colorSet.add(tile.get(index).colour);
      numberSet.add(tile.get(index).number);
    }
    return colorSet.size() == 1 && hand.size() == Collections.max(numberSet) - Collections.min(numberSet) + 1;
  }
  
  boolean isSequence(IntList hand) {
    //   At least 3 tiles, all same color, with consecutive numbers
    return hand.size() > 2 && isPresequence(hand);
  }
  
  boolean isPreCombination(IntList hand){
    return isPreSerie(hand) || isPresequence(hand);
  }
  
  boolean isCombination(IntList hand){
    return isSerie(hand) || isSequence(hand);
  }

}
