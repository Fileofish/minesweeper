export default function openCell(gameMatrix, targetCellId, mode, counterWin) {
  let numLine = (mode === 'easy') ? 10 : (mode === 'normal') ? 15 : 25;
  let x = Math.floor(targetCellId / numLine);
  let y = targetCellId % numLine;
  gameMatrix[x].splice(y, 1, `${gameMatrix[x][y]}o`);
  let openArrCells = [];
  openArrCells.push(targetCellId); 

  if (gameMatrix[x][y] === '0o') createOpenArrCells(gameMatrix, x, y, numLine, openArrCells);
  
  for (let i = 0; i < openArrCells.length; i++) {
    let idElem = openArrCells[i];
    let x = Math.floor(idElem / numLine);
    let y = idElem % numLine;
    let classCell = '';
    let inner = '';
    if (gameMatrix[x][y] === '0o') {classCell = 'cell-empty';}
    if (gameMatrix[x][y] === '1o') {classCell = 'n1'; inner = '1';}
    if (gameMatrix[x][y] === '2o') {classCell = 'n2'; inner = '2';}
    if (gameMatrix[x][y] === '3o') {classCell = 'n3'; inner = '3';}
    if (gameMatrix[x][y] === '4o') {classCell = 'n4'; inner = '4';}
    if (gameMatrix[x][y] === '5o') {classCell = 'n5'; inner = '5';}
    if (gameMatrix[x][y] === '6o') {classCell = 'n6'; inner = '6';}
    if (gameMatrix[x][y] === '7o') {classCell = 'n7'; inner = '7';}
    if (gameMatrix[x][y] === '8o') {classCell = 'n8'; inner = '8';}
    let currentElem = document.getElementById(String(idElem));
    if (currentElem.classList.contains('cell-flag')) currentElem.classList.remove('cell-flag')
    currentElem.classList.remove('cell__close');
    currentElem.classList.add(classCell);
    currentElem.innerHTML = inner;
  }
  return openArrCells.length;
}

function createOpenArrCells(gameMatrix, x, y, numLine, openArrCells) {
  let up = x - 1,
    down = x + 1,
    left = y - 1,
    right = y + 1;
  // Check Cell up
  if (up >= 0 && typeof gameMatrix[up][y] === 'number') {
    let cellId = up * numLine + y;
    gameMatrix[up].splice(y, 1, `${gameMatrix[up][y]}o`);
    openArrCells.push(cellId);
    if (gameMatrix[up][y] === '0o') createOpenArrCells(gameMatrix, up, y, numLine, openArrCells)
  }
  // Check Cell down
  if (down < numLine && typeof gameMatrix[down][y] === 'number') {
    let cellId = down * numLine + y;
    gameMatrix[down].splice(y, 1, `${gameMatrix[down][y]}o`);
    openArrCells.push(cellId);
    if (gameMatrix[down][y] === '0o') createOpenArrCells(gameMatrix, down, y, numLine, openArrCells)
  }
  // Check Cell right
  if (right < numLine && typeof gameMatrix[x][right] === 'number') {
    let cellId = x * numLine + right;
    gameMatrix[x].splice(right, 1, `${gameMatrix[x][right]}o`);
    openArrCells.push(cellId);
    if (gameMatrix[x][right] === '0o') createOpenArrCells(gameMatrix, x, right, numLine, openArrCells)
  }
  // Check Cell left
  if (left >= 0 && typeof gameMatrix[x][left] === 'number') {
    let cellId = x * numLine + left;
    gameMatrix[x].splice(left, 1, `${gameMatrix[x][left]}o`);
    openArrCells.push(cellId);
    if (gameMatrix[x][left] === '0o') createOpenArrCells(gameMatrix, x, left, numLine, openArrCells)
  }
  // Check Cell up-left
  if (up >= 0 && left >= 0 && typeof gameMatrix[up][left] === 'number') {
    let cellId = up * numLine + left;
    gameMatrix[up].splice(left, 1, `${gameMatrix[up][left]}o`);
    openArrCells.push(cellId);
    if (gameMatrix[up][left] === '0o') createOpenArrCells(gameMatrix, up, left, numLine, openArrCells)
  }
  // Check Cell up-right
  if (up >= 0 && right < numLine && typeof gameMatrix[up][right] === 'number') {
    let cellId = up * numLine + right;
    gameMatrix[up].splice(right, 1, `${gameMatrix[up][right]}o`);
    openArrCells.push(cellId);
    if (gameMatrix[up][right] === '0o') createOpenArrCells(gameMatrix, up, right, numLine, openArrCells)
  }
  // Check Cell down-right
  if (down < numLine && right < numLine && typeof gameMatrix[down][right] === 'number') {
    let cellId = down * numLine + right;
    gameMatrix[down].splice(right, 1, `${gameMatrix[down][right]}o`);
    openArrCells.push(cellId);
    if (gameMatrix[down][right] === '0o') createOpenArrCells(gameMatrix, down, right, numLine, openArrCells)
  }
  // Check Cell down-left
  if (down < numLine && left >= 0 && typeof gameMatrix[down][left] === 'number') {
    let cellId = down * numLine + left;
    gameMatrix[down].splice(left, 1, `${gameMatrix[down][left]}o`);
    openArrCells.push(cellId);
    if (gameMatrix[down][left] === '0o') createOpenArrCells(gameMatrix, down, left, numLine, openArrCells)
  }
}