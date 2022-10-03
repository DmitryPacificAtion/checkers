const defaultArrangements = {
  [CONSTANTS.FRIEND]: [
    'a7', 'e3', 'g7'
  ],
  [CONSTANTS.ALIEN]: [
    'h6', 'f2', 'b2',
  ],
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
  clearReadyField();
  clearPossibleStepsSelection();

  if (isEquals(CONSTANTS.FRIEND)(turn)) {
    setTurn(CONSTANTS.ALIEN);
  } else {
    setTurn(CONSTANTS.FRIEND);
  }
}

const onMoveHandler = ({ target }, fromId) => {
  const source = getFieldById(fromId);
  target.appendChild(source.firstChild);

  checkIsQueen(target);
  source.innerHTML = null;
  endTurn();
}

const onAtackHandler = ({ target }, fromId) => {
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

      const arr = directions.all.map(defineCellsForAttack(target.id)).filter(is);
      if(arr.length === 0) {
        checkIsQueen(target);
        target.onclick = null;
        endTurn();
      }
    }, 500);
  }
};

const defineCellsForAttack = id => direction => {
  const enemyCell = getFieldById(direction(1)(id));

  if (hasEnemy(enemyCell)) {
    const cellAfterEnemy = pipe(
      direction(2),
      getFieldById,
    )(id)

    if(cellAfterEnemy && isCellEmpty(cellAfterEnemy)) {
      highlightCellForAttack(enemyCell);
      highlightCellForMove(cellAfterEnemy);

      cellAfterEnemy.onclick = e => onAtackHandler(e, id);
      return cellAfterEnemy;
    }
  }
  return null;
}

const defineCellsToMove = id => direction => {
  const nextCell = getFieldById(direction(1)(id));

  if (nextCell && isCellEmpty(nextCell)) {
    highlightCellForMove(nextCell);

    nextCell.onclick = e => onMoveHandler(e, id);
    return nextCell;
  }

  return null;
}

const definePossibleSteps = (id) => {

  const directionsForAttack = directions.all.map(defineCellsForAttack(id)).filter(is);

  if (directionsForAttack.length === 0) {
    return pipe(
      isEquals(CONSTANTS.FRIEND),
      (flag) => flag ? directions.forward : directions.backward,
      map(defineCellsToMove(id)),
      filter(is)
    )(getTurn())
  }

  return directionsForAttack;

};

const onClickChecker = ({ target }) => {
  const { parentNode: cell } = target;
  if (getFieldById(cell.id)) {
    clearReadyField(cell.id);
    clearPossibleStepsSelection();
  }

  if (target.dataset[getTurn()]) {
    // console.time('select-checker');
    target.classList.add(CONSTANTS.READY);
    definePossibleSteps(cell.id);
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
};

(function() {
  init();
})()