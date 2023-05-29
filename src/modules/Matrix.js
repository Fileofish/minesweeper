export default class Matrix {
  constructor(mode) {
    this.mode = mode;
    this.numMines = 10;
    this.gameMatrix = [];
    this.arrMines = [];
  }

  createArrayMine(targetCellId) {
    let numCells = (this.mode === 'easy') ? 100 : (this.mode === 'normal') ? 225 : 625;
    for (let i = 0; i < this.numMines; i++) {
      let mineId;
      do {
        mineId = Math.floor(Math.random() * numCells);

      } while (mineId === targetCellId || this.arrMines.includes(mineId))
      this.arrMines.push(mineId);
    }
  }

  createGameMatrix() {
    let numLine = (this.mode === 'easy') ? 10 : (this.mode === 'normal') ? 15 : 25;
    for (let x = 0; x < numLine; x++) {
      this.gameMatrix.push([]);
      for (let y = 0; y < numLine; y++) {
        this.gameMatrix[x].push(0);
      }
    }

    for (let mine of this.arrMines) {
      this.gameMatrix[Math.floor(mine / numLine)][mine % numLine] = 'm';
    }

    for (let x = 0; x < numLine; x++) {
      let count = 0;
      for (let y = 0; y < numLine; y++) {
        if (y > 0 && this.gameMatrix[x][y-1] === 'm') count++;
        if (y < numLine-1 && this.gameMatrix[x][y+1] === 'm') count++;
        if (x > 0 && this.gameMatrix[x-1][y] === 'm') count++;
        if (x < numLine-1 && this.gameMatrix[x+1][y] === 'm') count++;
        if (y > 0 && x > 0 && this.gameMatrix[x-1][y-1] === 'm') count++;
        if (y < numLine-1 && x > 0 && this.gameMatrix[x-1][y+1] === 'm') count++;
        if (y > 0 && x < numLine-1 && this.gameMatrix[x+1][y-1] === 'm') count++;
        if (y < numLine-1 && x < numLine-1 && this.gameMatrix[x+1][y+1] === 'm') count++;
        if (this.gameMatrix[x][y] !== 'm') this.gameMatrix[x].splice(y, 1, count);
        count = 0;
      }
    }
  }
}



