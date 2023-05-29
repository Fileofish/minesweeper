import './index.css';
import HTMLDate from './assets/base/html-date.json';
import gameDate from './assets/base/game-date.json';
import soundOpenCell from './assets/sounds/open-cells.wav';
import soundClickMenu from './assets/sounds/menu.wav';
import soundFlag from './assets/sounds/flag.wav';
import importSoundLose from './assets/sounds/soundLose.wav';
import importSoundWin from './assets/sounds/soundWin.wav';
import initGame from './modules/initGame.js';
import Timer from './modules/Timer.js';
import initGameArea from './modules/initGameArea.js';
import Matrix from './modules/Matrix.js';
import openCell from './modules/openCell.js';

console.log(JSON.parse(localStorage.getItem('gameDate')));
let baseGame = gameDate;
if (JSON.parse(localStorage.getItem('gameDate')) !== null) {
  baseGame = JSON.parse(localStorage.getItem('gameDate'));
}
let mode = baseGame.autosave.mode;
let numMotion = baseGame.autosave.numMotion;
let firstClick = baseGame.autosave.firstClick;
let flags = baseGame.autosave.flags;

const soundOpen = new Audio(soundOpenCell);
const soundMenu = new Audio(soundClickMenu);
const soundSetFlag = new Audio(soundFlag);
const soundLose = new Audio(importSoundLose);
const soundWin = new Audio(importSoundWin);

const matrix = new Matrix (mode);
let voice = true;
matrix.gameMatrix = baseGame.autosave.gameMatrix;
matrix.arrMines = baseGame.autosave.arrMines;
let numFlag = matrix.numMines = baseGame.autosave.numMines;
let counterWin = baseGame.autosave.counterWin;

const bodyPage = document.querySelector('.page');
initGame(bodyPage, HTMLDate);

const timerDisplay = document.querySelector('.game__display__timer');
const timer = new Timer(timerDisplay);
timerDisplay.innerHTML = timer.timerMean = baseGame.autosave.timer;

const gameArea = document.querySelector('.game__area');
initGameArea(matrix.gameMatrix, gameArea, mode);
// Display motion coast and load flags
if (JSON.parse(localStorage.getItem('gameDate')) !== null) {
  document.querySelector('.game__display__motion').innerHTML = `Motion: ${(numMotion < 10) ? '00'+numMotion : (numMotion < 100) ? '0'+numMotion : numMotion}`;
  for (let flag of flags) {
    let currentElem = document.getElementById(flag);
    currentElem.classList.add('cell-flag');
  }
  numFlag -= flags.length;
  document.querySelector('.game__display__num-mine').innerHTML = `Mine left: ${(numFlag < 10) ? '0'+numFlag : numFlag}`;
}
openLoadingCells()
createSaveLoadCells()

document.addEventListener('contextmenu', function (event) {
  if (event.target.classList.contains('cell__close')) {
    if (event.target.classList.contains('cell-flag')) {
      let indexFlag = flags.indexOf(event.target.id);
      flags.splice(indexFlag, 1);
      numFlag++;
    } else {
      flags.push(event.target.id);
      numFlag--;
    }
    if (voice) soundSetFlag.play()
    event.preventDefault();
    event.target.classList.toggle('cell-flag');
    document.querySelector('.game__display__num-mine').innerHTML = `Mine left: ${(numFlag < 10) ? '0'+numFlag : numFlag}`;
  }
});

document.addEventListener('click', function (event) {

  if (event.target.classList.contains('cell__close') && !event.target.classList.contains('cell-flag') && firstClick) {
    let targetCellId = +event.target.id;
    matrix.arrMines = [];
    numMotion++;
    document.querySelector('.game__display__motion').innerHTML = `Motion: ${(numMotion < 10) ? '00'+numMotion : (numMotion < 100) ? '0'+numMotion : numMotion}`;
    matrix.createArrayMine(targetCellId);
    matrix.createGameMatrix();
    timer.startTimer();
    firstClick = false;
    counterWin = counterWin + openCell(matrix.gameMatrix, targetCellId, mode, counterWin);
    win();
    if (voice) soundOpen.play();

  } else if (event.target.classList.contains('cell__close') && !event.target.classList.contains('cell-flag') && !matrix.arrMines.includes(+event.target.id)) {
    let targetCellId = +event.target.id;
    numMotion++;
    document.querySelector('.game__display__motion').innerHTML = `Motion: ${(numMotion < 10) ? '00'+numMotion : (numMotion < 100) ? '0'+numMotion : numMotion}`;
    counterWin = counterWin + openCell(matrix.gameMatrix, targetCellId, mode, counterWin);
    if (JSON.parse(localStorage.getItem('gameDate')) !== null) {
      timer.clearTimer();
      timer.startTimer();
    }
    win();
    if (voice) soundOpen.play();

  } else if (!event.target.classList.contains('cell-flag') && event.target.classList.contains('cell__close') && matrix.arrMines.includes(+event.target.id)) {
    document.querySelector('.menu__window-win').classList.remove('active');
    document.querySelector('.game__content').classList.remove('active');
    document.querySelector('.menu__window-lose').classList.add('active');
    document.querySelector('.menu__window-lose__text__motion').innerHTML = `${(numMotion < 10) ? '00'+numMotion : (numMotion < 100) ? '0'+numMotion : numMotion}`;
    document.querySelector('.menu__window-lose__text__time').innerHTML = `${timer.timerMean}`;
    // Open all game area
    const numCells = (mode === 'easy') ? 100 : (mode === 'normal') ? 225 : 625;
    const numLine = (mode === 'easy') ? 10 : (mode === 'normal') ? 15 : 25;
    for (let i = 0; i < numCells; i++) {
      let meanMatrix = matrix.gameMatrix[Math.floor(i/numLine)][i%numLine];
      let elemDOM = document.getElementById(`${i}`);
      if (elemDOM.classList.contains('cell-flag')) elemDOM.classList.remove('cell-flag')
      if (meanMatrix === 'm') {
        elemDOM.classList.add('cell-mine');
        elemDOM.classList.remove('cell__close');
      } else if (meanMatrix === 0) {
        elemDOM.classList.add('cell-empty');
        elemDOM.classList.remove('cell__close');
      } else if (typeof meanMatrix === 'number') {
        elemDOM.classList.add(`n${meanMatrix}`);
        elemDOM.innerHTML = `${meanMatrix}`
        elemDOM.classList.remove('cell__close');
      }
    }
    timer.clearTimer();
    if (voice) soundLose.play();

  } else if (event.target.classList.contains('load')) {
    document.querySelector('.menu__bg-opacity').classList.add('active');
    document.querySelector('.menu__load-game').classList.add('active');
    document.querySelector('.menu__bar').classList.remove('active');
    if (voice) soundMenu.play();

  } else if (event.target.classList.contains('button-menu')) {
    let menu = document.querySelector('.menu__bg-opacity');
    if (!menu.classList.contains('active')) menu.classList.add('active');
    document.querySelector('.menu__load-game').classList.remove('active');
    document.querySelector('.menu__bar').classList.add('active');
    timer.clearTimer();
    if (voice) soundMenu.play();

  } else if (event.target.classList.contains('continue')) {
    document.querySelector('.menu__bg-opacity').classList.remove('active');
    document.querySelector('.menu__bar').classList.remove('active');
    document.querySelector('.menu__save-game').classList.remove('active');
    document.querySelector('.menu__bg-opacity').classList.remove('active');
    if (!firstClick) timer.startTimer();
    if (voice) soundMenu.play();

  } else if (event.target.classList.contains('save')) {
    document.querySelector('.menu__save-game').classList.add('active');
    document.querySelector('.menu__bg-opacity').classList.add('active');
    timer.clearTimer();
    if (voice) soundMenu.play();

  } else if (event.target.classList.contains('start-over') || event.target.classList.contains('lose__buttons__start-over')) {
    document.querySelector('.menu__window-win').classList.remove('active');
    document.querySelector('.menu__window-lose').classList.remove('active');
    const gameContent = document.querySelector('.game__content')
    if (!gameContent.classList.contains('active')) gameContent.classList.add('active');

    timer.clearTimer();
    timer.timerMean = '00:00:00';
    timer.timerDisplay.innerHTML = '00:00:00';
    matrix.gameMatrix = [];
    flags = [];
    numMotion = 0;
    firstClick = true;
    numFlag = matrix.numMines;
    document.querySelector('.game__display__num-mine').innerHTML = `Mine left: ${numFlag}`;
    document.querySelector('.game__display__motion').innerHTML = 'Motion: 000';
    document.querySelector('.game__area').innerHTML = '';
    initGameArea(matrix.gameMatrix, gameArea, mode);
    counterWin = 0;
    if (voice) soundMenu.play();
    
  } else if (event.target.classList.contains('complexity-easy') || event.target.classList.contains('complexity-normal') || event.target.classList.contains('complexity-hard')) {
    if (event.target.classList.contains('complexity-easy')) mode = matrix.mode = 'easy';
    if (event.target.classList.contains('complexity-normal')) mode = matrix.mode = 'normal';
    if (event.target.classList.contains('complexity-hard')) mode = matrix.mode = 'hard';
    
    let enterNumMines = +document.querySelector('.menu__bar__input').value
    if (enterNumMines > 99) {
      matrix.numMines = numFlag = 99;
    } else if (enterNumMines < 10) {
      matrix.numMines = numFlag = 10;
    } else {
      matrix.numMines = numFlag = enterNumMines;
    }
    timer.timerMean = timer.timerDisplay.innerHTML = '00:00:00';
    if (matrix.numMines === 0) matrix.numMines= numFlag = 10;
    matrix.gameMatrix = [];
    flags = [];
    numMotion = 0;
    firstClick = true;
    document.querySelector('.menu__bg-opacity').classList.remove('active');
    document.querySelector('.game__display__motion').innerHTML = 'Motion: 000';
    document.querySelector('.game__display__num-mine').innerHTML = `Mine left: ${numFlag}`;
    document.querySelector('.menu__bar').classList.remove('active');
    document.querySelector('.game__area').innerHTML = '';
    document.querySelector('.mode').innerHTML = mode;
    document.querySelector('.number-mine').innerHTML = matrix.numMines;
    initGameArea(matrix.gameMatrix, gameArea, mode);
    counterWin = 0;
    if (voice) soundMenu.play();

  } else if (event.target.classList.contains('menu__cell') && event.target.classList.contains('cell-save')) {
    document.querySelector('.menu__save-game').classList.remove('active');
    document.querySelector('.menu__bg-opacity').classList.remove('active');
    timer.startTimer();
    let now = new Date();
    let data = `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
    event.target.innerHTML = `Save ${event.target.id[2]} - Date ${data}`;
    let loadCell = document.getElementById(`lC${event.target.id[2]}`);
    loadCell.innerHTML =  `Save ${event.target.id[2]} - Date ${data}`;
    event.target.innerHTML = `Save ${event.target.id[2]} - Date ${data}`;
    event.target.classList.add('active');
    loadCell.classList.add('active');
    if (voice) soundMenu.play();

    if (event.target.id[2] === "1") {
      baseGame.save1 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "2") {
      baseGame.save2 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "3") {
      baseGame.save3 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "4") {
      baseGame.save4 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "5") {
      baseGame.save5 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "6") {
      baseGame.save6 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "7") {
      baseGame.save7 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "8") {
      baseGame.save8 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "9") {
      baseGame.save9 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    } else if (event.target.id[2] === "10") {
      baseGame.save10 = {check: true, mode: mode, gameMatrix: matrix.gameMatrix, arrMines: matrix.arrMines, numMotion: numMotion, timer: timer.timerMean, numMines: matrix.numMines, numFlag: numFlag, firstClick: firstClick, counterWin: counterWin, flags: flags, name: `Save ${event.target.id[2]} - Date ${data}`};
    }
    localStorage.setItem('gameDate', JSON.stringify(baseGame));
  } else if (event.target.classList.contains('menu__cell') && event.target.classList.contains('cell-load')) {
    document.querySelector('.menu__load-game').classList.remove('active');
    document.querySelector('.menu__bg-opacity').classList.remove('active');
    let loadBase = {};
    let parseBase = JSON.parse(localStorage.getItem('gameDate'));
    if (event.target.id[2] === "1") loadBase = parseBase.save1;
    if (event.target.id[2] === "2") loadBase = parseBase.save2;
    if (event.target.id[2] === "3") loadBase = parseBase.save3;
    if (event.target.id[2] === "4") loadBase = parseBase.save4;
    if (event.target.id[2] === "5") loadBase = parseBase.save5;
    if (event.target.id[2] === "6") loadBase = parseBase.save6;
    if (event.target.id[2] === "7") loadBase = parseBase.save7;
    if (event.target.id[2] === "8") loadBase = parseBase.save8;
    if (event.target.id[2] === "9") loadBase = parseBase.save9;
    if (event.target.id[2] === "10") loadBase = parseBase.save10;

    console.log(loadBase)

    mode = loadBase.mode;
    numMotion = loadBase.numMotion;
    firstClick = loadBase.firstClick;
    flags = loadBase.flags;
    matrix.gameMatrix = loadBase.gameMatrix;
    matrix.arrMines = loadBase.arrMines;
    numFlag = matrix.numMines = loadBase.numMines;
    counterWin = loadBase.counterWin;
    document.querySelector('.game__area').innerHTML = '';
    timerDisplay.innerHTML = timer.timerMean = loadBase.timer;
    initGameArea(matrix.gameMatrix, gameArea, mode);
    document.querySelector('.mode').innerHTML = mode;
    document.querySelector('.number-mine').innerHTML = matrix.numMines;
    document.querySelector('.game__display__motion').innerHTML = `Motion: ${(numMotion < 10) ? '00'+numMotion : (numMotion < 100) ? '0'+numMotion : numMotion}`;
    for (let flag of flags) {
      let currentElem = document.getElementById(flag);
      currentElem.classList.add('cell-flag');
    }
    numFlag -= flags.length;
    document.querySelector('.game__display__num-mine').innerHTML = `Mine left: ${(numFlag < 10) ? '0'+numFlag : numFlag}`;
    if (matrix.gameMatrix.length) {
      let lines = matrix.gameMatrix.length;
      for (let x = 0; x < lines; x++) {
        for (let y = 0; y < lines; y++) {
          if (matrix.gameMatrix[x][y][1] === 'o') {
            let currentCell = document.getElementById(`${x * lines + y}`);
            currentCell.classList.remove('cell__close');
            if (matrix.gameMatrix[x][y][0] === '0') {
              currentCell.classList.add('cell-empty');
            } else {
              currentCell.classList.add(`n${matrix.gameMatrix[x][y][0]}`);
              currentCell.innerHTML = matrix.gameMatrix[x][y][0]
            }
          }
        }
      }
    }
      if (voice) soundMenu.play();

  } else if (event.target.classList.contains('button-toggle-theme') || event.target.classList.contains('button-toggle-theme-inner')) {
    document.querySelector('.main').classList.toggle('dark');
    document.querySelector('.menu').classList.toggle('dark');
    document.querySelector('.menu__bg-opacity').classList.toggle('dark');
    document.querySelector('.menu__wrapper').classList.toggle('dark');
    document.querySelector('.menu__bar__input__info').classList.toggle('dark');
    document.querySelector('.button-toggle-theme').classList.toggle('dark');
    document.querySelector('.button-toggle-theme-inner').classList.toggle('dark');
    const aArr = document.querySelectorAll("a");
    aArr.forEach((elements) => {
      elements.classList.toggle('dark');;
    });
    document.querySelector('.game__display__num-mine').classList.toggle('dark');
    document.querySelector('.game__display__motion').classList.toggle('dark');
    document.querySelector('.game__display__timer').classList.toggle('dark');
    document.querySelector('.game__display').classList.toggle('dark');
    const cellArr = document.querySelectorAll(".cell");
    cellArr.forEach((elements) => {
      elements.classList.toggle('dark');;
    });
      if (voice) soundMenu.play();
  } else if (event.target.classList.contains('button-toggle-voice') || event.target.classList.contains('button-toggle-voice-inner')) {
    if (event.target.classList.contains('mute')) {
      voice = true;
    } else {
      voice = false;
    }
    document.querySelector('.button-toggle-voice').classList.toggle('mute');
    document.querySelector('.button-toggle-voice-inner').classList.toggle('mute');
  }
});

function win() {
if (mode === 'easy' && counterWin === 100 - matrix.numMines 
  || mode === 'normal' && counterWin === 225 - matrix.numMines 
  || mode === 'hard' && counterWin === 625 - matrix.numMines) {
    document.querySelector('.game__content').classList.remove('active');
    document.querySelector('.menu__window-win').classList.add('active');
    document.querySelector('.menu__window-win__text__motion').innerHTML = `${(numMotion < 10) ? '00'+numMotion : (numMotion < 100) ? '0'+numMotion : numMotion}`
    document.querySelector('.menu__window-win__text__time').innerHTML = `${timer.timerMean}`
    // Open all game area
    const numCells = (mode === 'easy') ? 100 : (mode === 'normal') ? 225 : 625;
    const numLine = (mode === 'easy') ? 10 : (mode === 'normal') ? 15 : 25;
    for (let i = 0; i < numCells; i++) {
      let meanMatrix = matrix.gameMatrix[Math.floor(i/numLine)][i%numLine];
      let elemDOM = document.getElementById(`${i}`);
      if (elemDOM.classList.contains('cell-flag')) elemDOM.classList.remove('cell-flag')
      if (meanMatrix === 'm') {
        elemDOM.classList.add('cell-mine');
        elemDOM.classList.remove('cell__close');
      } else if (meanMatrix === 0) {
        elemDOM.classList.add('cell-empty');
        elemDOM.classList.remove('cell__close');
      } else if (typeof meanMatrix === 'number') {
        elemDOM.classList.add(`n${meanMatrix}`);
        elemDOM.innerHTML = `${meanMatrix}`
        elemDOM.classList.remove('cell__close');
      }
    }
    timer.clearTimer();
    if (voice) soundWin.play();
  }
}
function openLoadingCells () {
  if (matrix.gameMatrix.length) {
    let lines = matrix.gameMatrix.length;
    for (let x = 0; x < lines; x++) {
      for (let y = 0; y < lines; y++) {
        if (matrix.gameMatrix[x][y][1] === 'o') {
          let currentCell = document.getElementById(`${x * lines + y}`);
          currentCell.classList.remove('cell__close');
          if (matrix.gameMatrix[x][y][0] === '0') {
            currentCell.classList.add('cell-empty');
          } else {
            currentCell.classList.add(`n${matrix.gameMatrix[x][y][0]}`);
            currentCell.innerHTML = matrix.gameMatrix[x][y][0]
          }
        }
      }
    }
  }
}
function createSaveLoadCells () {
  if (baseGame.save1.check) {
    const load1 = document.getElementById('lC1');
    const save1 = document.getElementById('sC1');
    load1.classList.add('active');
    save1.classList.add('active');
    load1.innerHTML = save1.innerHTML = baseGame.save1.name;
  }
  if (baseGame.save2.check) {
    const load2 = document.getElementById('lC2');
    const save2 = document.getElementById('sC2');
    load2.classList.add('active');
    save2.classList.add('active');
    load2.innerHTML = save2.innerHTML = baseGame.save2.name;
  }
  if (baseGame.save3.check) {
    const load3 = document.getElementById('lC3');
    const save3 = document.getElementById('sC3');
    load3.classList.add('active');
    save3.classList.add('active');
    load3.innerHTML = save3.innerHTML = baseGame.save3.name;
  }
  if (baseGame.save4.check) {
    const load4 = document.getElementById('lC4');
    const save4 = document.getElementById('sC4');
    load4.classList.add('active');
    save4.classList.add('active');
    load4.innerHTML = save4.innerHTML = baseGame.save4.name;
  }
  if (baseGame.save5.check) {
    const load5 = document.getElementById('lC5');
    const save5 = document.getElementById('sC5');
    load5.classList.add('active');
    save5.classList.add('active');
    load5.innerHTML = save5.innerHTML = baseGame.save5.name;
  }
  if (baseGame.save6.check) {
    const load6 = document.getElementById('lC6');
    const save6 = document.getElementById('sC6');
    load6.classList.add('active');
    save6.classList.add('active');
    load6.innerHTML = save6.innerHTML = baseGame.save6.name;
  }
  if (baseGame.save7.check) {
    const load7 = document.getElementById('lC7');
    const save7 = document.getElementById('sC7');
    load7.classList.add('active');
    save7.classList.add('active');
    load7.innerHTML = save7.innerHTML = baseGame.save7.name;
  }
  if (baseGame.save8.check) {
    const load8 = document.getElementById('lC8');
    const save8 = document.getElementById('sC8');
    load8.classList.add('active');
    save8.classList.add('active');
    load8.innerHTML = save8.innerHTML = baseGame.save8.name;
  }
  if (baseGame.save9.check) {
    const load9 = document.getElementById('lC9');
    const save9 = document.getElementById('sC9');
    load9.classList.add('active');
    save9.classList.add('active');
    load9.innerHTML = save9.innerHTML = baseGame.save9.name;
  }
  if (baseGame.save10.check) {
    const load10 = document.getElementById('lC10');
    const save10 = document.getElementById('sC10');
    load10.classList.add('active');
    save10.classList.add('active');
    load10.innerHTML = save9.innerHTML = baseGame.save10.name;
  }
}
window.onbeforeunload = function () {
  baseGame.autosave.mode = mode;
  baseGame.autosave.gameMatrix = matrix.gameMatrix;
  baseGame.autosave.arrMines = matrix.arrMines;
  baseGame.autosave.numMotion = numMotion;
  baseGame.autosave.timer = timer.timerMean;
  baseGame.autosave.numMines = matrix.numMines;
  baseGame.autosave.numFlag = numFlag;
  baseGame.autosave.firstClick = firstClick;
  baseGame.autosave.counterWin = counterWin;
  baseGame.autosave.flags = flags;
  localStorage.setItem('gameDate', JSON.stringify(baseGame));
}