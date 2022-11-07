const defaultArrangements = {
  [CONSTANTS.FRIEND]: ['a7', 'e3', 'g7'],
  [CONSTANTS.ALIEN]: ['h6', 'f2', 'b2'],
  // [CONSTANTS.FRIEND]: [
  //   'a1', 'c1', 'e1', 'g1',
  //   'b2', 'd2', 'f2', 'h2',
  //   'a3', 'c3', 'e3', 'g3',
  // ],
  // [CONSTANTS.ALIEN]: [
  //   'b8', 'd8', 'f8', 'h8',
  //   'a7', 'c7', 'e7', 'g7',
  //   'b6', 'd6', 'f6', 'h6',
  // ],
};

const setPointers = () => {
  document.querySelectorAll(`.${getTurn()}`).forEach(cell => cell.classList.add('pointer'));
}

const clearPointers = () => {
  document.querySelectorAll('.pointer').forEach(cell => cell.classList.remove('pointer'));
}

const clearPossibleStepsSelection = () => {
  document.querySelectorAll(`.${CONSTANTS.POSSIBLE_STEP}`).forEach(cell => {
    cell.classList.remove(CONSTANTS.POSSIBLE_STEP);
    cell.onclick = null;
  });
  document.querySelectorAll(`.${CONSTANTS.POSSIBLE_ATTACK}`).forEach(cell => {
    cell.classList.remove(CONSTANTS.POSSIBLE_ATTACK);
  });
};

const clearReadyField = () => {
  document.querySelector('.ready')?.classList.remove(CONSTANTS.READY);
};

const endTurn = () => {
  const turn = getTurn();
  clearPossibleStepsSelection();
  clearPointers();

  if (isEquals(CONSTANTS.FRIEND)(turn)) {
    setTurn(CONSTANTS.ALIEN);
  } else {
    setTurn(CONSTANTS.FRIEND);
  }

  setPointers();
};

const onMoveHandler = (fromId) => ({ target }) => {
  const source = document.getElementById(fromId);
  source.classList.remove(CONSTANTS.READY, getTurn());
  target.classList.add(getTurn());
  isQueen(target) && upgradeToQueen(target);
  endTurn();
};

const onAtackHandler = fromId => ({ target }) => {
  const [resultDirection] = directions.diff(fromId, target.id);

  const source = getFieldById(fromId);
  const enemyId = resultDirection(1)(target.id);
  const enemy = getFieldById(enemyId);

  // if (enemy) {
  //   source.classList.remove(getTurn());
  //   enemy.classList.remove(get);
  //   enemy.classList.add('remove-checker');

  //   setTimeout(() => {
  //     clearPossibleStepsSelection();

  //     const arr = directions.all
  //       .map(defineCellsForAttack(target.id))
  //       .filter(is);
  //     if (arr.length === 0) {
  //       target.onclick = onClickChecker;
  //       endTurn();
  //     }
  //   }, 500);
  // }
};

const defineCellsForAttack = (target) => (direction) => {
  const nextCell = getFieldById(direction(1)(target.id));

  if (hasEnemy(nextCell.firstChild)) {
    const cellAfterEnemy = getFieldById(direction(2)(target.id));

    if (cellAfterEnemy && isCellEmpty(cellAfterEnemy)) {
      highlightCellForAttack(nextCell);
      highlightCellForMove(cellAfterEnemy);
      cellAfterEnemy.onclick = onAtackHandler(target.id);
      return cellAfterEnemy;
    }
  }
  return null;
};

const defineCellsToMove = (id) => (direction) => {
  const nextCell = document.getElementById(direction(1)(id));

  if (nextCell && isCellEmpty(nextCell)) {
    highlightCellForMove(nextCell);

    nextCell.onclick = onMoveHandler(id);
  }

  return null;
};

const definePossibleSteps = (target) => {
  const directionsForAttack = directions.all
    .map(defineCellsForAttack(target))
    .filter(is);

  if (directionsForAttack.length === 0) {
    let waysToMove = [];

    if(isQueen(target)) {
      // console.log('friend queen');
    } else {
      if (getTurn() === CONSTANTS.FRIEND) {
        // console.log('friend simple');
        waysToMove = directions.forward;
    } else {
        // console.log('enemy simple');
        waysToMove = directions.backward;
      }
    }

    waysToMove.forEach(defineCellsToMove(target.id))
  }
};

const onClickChecker = ({ target }) => {
  if (getFieldById(target.id)) {
    clearPossibleStepsSelection();
    clearReadyField();
  }

  if (target.dataset[getTurn()]) {
    // console.time('select-checker');
    target.classList.add(CONSTANTS.READY);
    console.log('click', target);
    definePossibleSteps(target);

    // console.timeEnd('select-checker');
  }
};

const createChecker = (field, teamName, index) => {
  field.addEventListener('click', onClickChecker);
  field.classList.add(teamName);
  field.setAttribute(`data-${teamName}`, index);
};

const putCheckerToTheBoard = (field, index) => {
  if (defaultArrangements[CONSTANTS.FRIEND].includes(field.id)) {
    createChecker(field, CONSTANTS.FRIEND, index);
  }
  if (defaultArrangements[CONSTANTS.ALIEN].includes(field.id)) {
    createChecker(field, CONSTANTS.ALIEN, index);
  }
};

function init() {
  console.time('init');
  // TODO: Reduce amount of <div />

  getFieldsHTML().forEach((field, index) => {
    putCheckerToTheBoard(field, index);
  });

  setPointers()
}

(function () {
  init();
})();
