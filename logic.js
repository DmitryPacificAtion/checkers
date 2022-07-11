const defaultArrangements = {
  [CONSTANTS.FRIEND]: [
    'a7', 'g7', 'e1',
    'b4', 'c5', 'e3',
    'b2', 'h2',
  ],
  [CONSTANTS.ALIEN]: [
    'b8', 'f8', 'h8',
    'b6', 'f6', 'h6',
    'a3', 'c3', 'f2',
    'a1', 'c1', 'g1'
  ],
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
const state = {
  selectedCheckerId: null,
  kickedOffCheckerIds: [],
};

const clearPrevSelectedFields = () => {
  getFieldsHTML().forEach(step => {
    if (step) {
      step.removeEventListener('click', onMoveHandler());
      step.removeEventListener('click', onAtackHandler());
      step.classList.remove(CONSTANTS.READY, CONSTANTS.POSSIBLE_STEP, CONSTANTS.POSSIBLE_ATTACK)
    }
  });
  state.kickedOffCheckerIds = [];
  state.selectedCheckerId = null;
};

const defineEnemy = id => direction => {
  const nextCell = getFieldById(direction(1)(id));

  if (hasEnemy(nextCell)) {
    const cellAfterNext = pipe(
      direction(2),
      getFieldById,
    )(id)

    if(cellAfterNext && isCellEmpty(cellAfterNext)) {
      highlightCellForAttack(nextCell);
      highlightCellForMove(cellAfterNext);

      cellAfterNext.addEventListener('click', onMoveHandler(id));
      return cellAfterNext;
    }
  }
  return null;
}

const defineCellsToMove = id => direction => {
  const nextCell = getFieldById(direction(1)(id));

  if (nextCell && isCellEmpty(nextCell)) {
    highlightCellForMove(nextCell);
    nextCell.addEventListener('click', onMoveHandler(id));
    return nextCell;
  }

  return null;
}

const definePossibleSteps = (id) => {

  // TODO: Incapsulate and Simplify coordinates logic
  const directionsForAttack = directions.all.map(defineEnemy(id)).filter(is);

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
    clearPrevSelectedFields();
  }

  if (target.dataset[getTurn()]) {
    console.time('select-checker');
    cell.classList.add(CONSTANTS.READY);
    definePossibleSteps(cell.id);
    console.timeEnd('select-checker');
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