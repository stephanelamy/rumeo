// For the moment I don't consider jokers
// group is an array of tile numbers

class Filter{
  constructor(tile){
    this.tile = tile;
  }

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
