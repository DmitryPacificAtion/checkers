const defaultArrangements = {
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

const endTurn = () => {
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

const onMoveHandler =
  (fromId) =>
  ({ target }) => {
    const source = getFieldById(fromId);
    target.appendChild(source.firstChild);
    shouldUpgrateToQueen(target.firstChild) &&
      upgradeToQueen(target.firstChild);
    source.innerHTML = null;
    endTurn();
  };

const onAtackHandler =
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
      }, 500);
    }
  };

const defineCellsForAttack = (cell) => (direction) => {
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

const defineCellsToMove = (cell) => (direction) => {
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

const definePossibleSteps = (cell) => {
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

const onClickChecker = ({ target }) => {
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

const createChecker = (name, index) => {
  const div = document.createElement('div');
  div.addEventListener('click', onClickChecker);

  div.classList.add(name);
  div.setAttribute(`data-${name}`, index);
  return div;
};

const putCheckerToTheBoard = (name, field, index) => {
  if (defaultArrangements[name].includes(field.id)) {
    const checker = createChecker(name, index);
    field.appendChild(checker);
  }
};

function init() {
  console.time('init');
  // TODO: Reduce amount of <div />

  getFieldsHTML().forEach((field, index) => {
    putCheckerToTheBoard(CONSTANTS.FRIEND, field, index);
    putCheckerToTheBoard(CONSTANTS.ALIEN, field, index);
  });
}

(function () {
  init();
  document.getElementById('give-up').addEventListener('click', giveUp)
})();
