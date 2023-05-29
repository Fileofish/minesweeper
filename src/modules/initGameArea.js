export default function initGameArea(gameMatrix, gameArea, mode) {
  let numCells = (mode === 'easy') ? 10 : (mode === 'normal') ? 15 : 25;
  let linesCells;
  let idCell = 0;
  for (let i = 0; i < numCells; i++) {
    let cell;
    // if (gameMatrix.length === 0) gameMatrix.push([]);
    linesCells = document.createElement('div');
    linesCells.className = `line-cells`;
    gameArea.append(linesCells);
    for (let j = 0; j < numCells; j++) {
      cell = document.createElement('div');
      cell.className = `cell cell__close`;
      cell.id = idCell;
      idCell++;
      linesCells.append(cell);
      // if (gameMatrix.length === 0) gameMatrix[i].push(0);
    }
  }
}