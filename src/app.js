import {
  CONSTANTS,
  getFieldsHTML,
  getFieldById,
  getTurn,
  clearPossibleStepsSelection,
  clearReadyField,
  setTurn,
  setPointers,
  clearPointers,
  isWinner,
  showWinnerModal,
  isCellEmpty,
  oppositePlayer,
  hasEnemy,
  highlightCellForMove,
  highlightCellForAttack,
  directions,
  isQueen,
  shouldUpgrateToQueen,
  upgradeToQueen,
  updateScore,
} from './helper';

import { isEquals, is, curry } from './functional-utils';

export const defaultArrangements = {
  [CONSTANTS.FRIEND]: ['a7', 'e3'],
  [CONSTANTS.ALIEN]: ['d6', 'b4'],
  // [CONSTANTS.FRIEND]: [
  //   'a7', 'g7', 'e1',
  //   'b4', 'd6', 'e3',
  //   'b2', 'h2',
  // ],
  // [CONSTANTS.ALIEN]: [
  //   'b8', 'f8', 'h8',
  //   'b6', 'f6', 'h6',
  //   'a3', 'c3', 'f2',
  //   'a1', 'c1', 'g1'
  // ],
  // [CONSTANTS.FRIEND]: [
  //   'a1', 'c1', 'e1', 'g1',
  //   'b2', 'd2', 'f2', 'h2',
  //   'a3', 'c3', 'e3', 'g3',
  // ],
  // [CONSTANTS.ALIEN]: [
  //   'b8', 'd8', 'f8', 'h8',
  //   'a7', 'c7', 'e7', 'g7',
  //   'b6', 'd6', 'f6', 'h6',
  // ]
};

export const endGame = () => {
  Object.values(document.querySelectorAll(`.${CONSTANTS.FRIEND}`)).forEach(
    (cell) => {
      cell.onclick = null;
      cell.removeEventListener('click', onClickChecker);
    }
  );
  Object.values(document.querySelectorAll(`.${CONSTANTS.ALIEN}`)).forEach(
    (cell) => {
      cell.onclick = null;
      cell.removeEventListener('click', onClickChecker);
    }
  );
  clearPointers();
  document.getElementById('give-up').removeEventListener('click', giveUp);
};

export const giveUp = () => {
  showWinnerModal(oppositePlayer(getTurn()));
  clearReadyField();
  clearPossibleStepsSelection();
  endGame();
};

export const endTurn = () => {
  const turn = getTurn();
  clearReadyField();
  clearPossibleStepsSelection();

  clearPointers();
  if (isWinner(turn)) {
    showWinnerModal(turn);
    endGame();
  } else {
    if (isEquals(CONSTANTS.FRIEND)(turn)) {
      setTurn(CONSTANTS.ALIEN);
    } else {
      setTurn(CONSTANTS.FRIEND);
    }
    setPointers(turn);
  }
};

export const onMoveHandler =
  (fromId) =>
  ({ target }) => {
    const source = getFieldById(fromId);
    target.appendChild(source.firstChild);
    shouldUpgrateToQueen(target.firstChild) &&
      upgradeToQueen(target.firstChild);
    source.innerHTML = null;
    endTurn();
  };

export const onAtackHandler =
  (fromId) =>
  ({ target }) => {
    const [resultDirection] = directions.diff(fromId, target.id);

    const source = getFieldById(fromId);
    const enemyId = resultDirection(1)(target.id);
    const enemy = getFieldById(enemyId);

    if (enemy) {
      target.appendChild(source.firstChild);
      enemy.firstChild.classList.add('remove-checker');

      setTimeout(() => {
        enemy.innerHTML = null;
        clearPossibleStepsSelection();

        const arr = directions.all.map(defineCellsForAttack(target)).filter(is);
        if (arr.length === 0) {
          target.onclick = null;
          endTurn();
        }
        updateScore();
      }, 500);
    }
  };

export const defineCellsForAttack = (cell) => (direction) => {
  const cellsForAttack = [];
  for (var index = 1; ; index++) {
    const nextCell = document.getElementById(direction(index)(cell.id));
    const cellAfterNext = getFieldById(direction(index + 1)(cell.id));

    if (!(nextCell && cellAfterNext)) return null;
    if (hasEnemy(nextCell) && isCellEmpty(cellAfterNext)) {
      cellsForAttack.push(nextCell);
      !isCellEmpty(nextCell) && highlightCellForMove(cellAfterNext);
      cellAfterNext.onclick = onAtackHandler(cell.id);
      return cellsForAttack.map(highlightCellForAttack);
    } else if (isQueen(cell.firstChild) && isCellEmpty(nextCell)) {
      continue;
    } else {
      return null;
    }
  }
};

export const defineCellsToMove = (cell) => (direction) => {
  const foundCells = [];
  for (var index = 1; ; index++) {
    const nextCell = document.getElementById(direction(index)(cell.id));
    if (!nextCell || !isCellEmpty(nextCell)) break; // Skip undefined cells
    nextCell.onclick = onMoveHandler(cell.id);
    foundCells.push(nextCell);
    if (!isQueen(cell.firstChild)) {
      // If cell is !isQueen - finish
      break;
    }
  }

  return foundCells.map(highlightCellForMove);
};

export const definePossibleSteps = (cell) => {
  const { firstChild: target } = cell;
  const directionsForAttack = directions.all
    .map(defineCellsForAttack(cell))
    .filter(is);
  if (directionsForAttack.length === 0) {
    if (isQueen(target)) {
      directions.all.forEach(defineCellsToMove(cell));
    } else {
      if (getTurn() === CONSTANTS.FRIEND) {
        directions.forward.forEach(defineCellsToMove(cell));
      } else {
        directions.backward.forEach(defineCellsToMove(cell));
      }
    }
  }

  return directionsForAttack;
};

export const onClickChecker = ({ target }) => {
  const { parentNode: cell } = target;
  if (getFieldById(cell.id)) {
    clearReadyField();
    clearPossibleStepsSelection();
  }

  if (target.dataset[getTurn()]) {
    // console.time('select-checker');
    target.classList.add(CONSTANTS.READY);
    definePossibleSteps(cell);
    // console.timeEnd('select-checker');
  }
};

export const createChecker = (name, index) => {
  const div = document.createElement('div');
  div.addEventListener('click', onClickChecker);

  div.classList.add(name);
  div.setAttribute(`data-${name}`, index);
  return div;
};

export const putCheckerToTheBoard = (name, field, index) => {
  if (defaultArrangements[name].includes(field.id)) {
    const checker = createChecker(name, index);
    field.appendChild(checker);
  }
};

export default function init() {
  console.time('init');
  curry(is, [1, 2, 3])();
  getFieldsHTML().forEach((field, index) => {
    putCheckerToTheBoard(CONSTANTS.FRIEND, field, index);
    putCheckerToTheBoard(CONSTANTS.ALIEN, field, index);
  });
  updateScore();
}

(function () {
  init();
  document.getElementById('give-up').addEventListener('click', giveUp);
})();

// module.exports = {
//   defaultArrangements,
//   endGame,
//   giveUp,
//   endTurn,
//   onMoveHandler,
//   onAtackHandler,
//   defineCellsForAttack,
//   defineCellsToMove,
//   definePossibleSteps,
//   onClickChecker,
//   createChecker,
//   putCheckerToTheBoard,
// }
