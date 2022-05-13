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
  
  parse(){
    // return an array of groups (of contiguous tiles) on table
    const result = [];
    for (let row=0; row < this.rows; row++){
      let currentGroup = [];
      for (let col=0; col < this.cols; col++){
        if (this.place[row][col] == 'empty' || col == this.cols - 1){
          if (currentGroup.length > 0){
            result.push(currentGroup);
            currentGroup = [];
          }
        } else {
          currentGroup.push(this.place[row][col]);
        }
      }
    }
    return result;
  }

  status(){
    let isCompletable = true;
    let isValid = true;
    const groups = this.parse();
    for (const group of groups){
      isCompletable = isCompletable && this.isPreCombination(group);
      isValid = isValid && this.isCombination(group);
    } 
    return [isCompletable, isValid];
  }

  parseOLD(){
    let isCompletable = true;
    let isValid = true;
    for (let row=0; row < this.rows; row++){
      let currentGroup = [];
      for (let col=0; col < this.cols; col++){
        if (this.place[row][col] == 'empty' || col == this.cols - 1){
          if (currentGroup.length > 0){
            isCompletable = isCompletable && this.isPreCombination(currentGroup);
            isValid = isValid && this.isCombination(currentGroup);
            currentGroup = [];
          }
        } else {
          currentGroup.push(this.place[row][col]);
        }
      }
    }
    return [isCompletable, isValid];
  }

  // For the moment I don't consider jokers
  // group is an array of tile numbers
  // might be better to put these functions in Grid, since also useful for the rack

  isPreSerie(group) {
      //  Tiles with the same number, and distinct colors
      const colorSet = new Set();
      const numberSet = new Set();
      for (const index of group) {
      colorSet.add(this.tile[index].color);
      numberSet.add(this.tile[index].number);
      }
      return numberSet.size == 1 && colorSet.size == group.length;
  }

  isSerie(group) {
    // 3 or 4 tiles with the same number, and distinct colors
    return group.length > 2 && this.isPreSerie(group);
  }
  
  isPreSequence(group) {
    // all same color, with consecutive numbers
    const colorSet = new Set();
    const numberArray = [];
    for (const index of group) {
      colorSet.add(this.tile[index].color);
      numberArray.push(this.tile[index].number);
    }
    return colorSet.size == 1 && group.length == Math.max(...numberArray) - Math.min(...numberArray) + 1;
  }
  
  isSequence(group) {
  //   At least 3 tiles, all same color, with consecutive numbers
  return group.length > 2 && this.isPreSequence(group);
  }
  
  isPreCombination(group) {
    return this.isPreSerie(group) || this.isPreSequence(group);
  }

  isCombination(group) {
    return this.isSerie(group) || this.isSequence(group);
  }
}
  