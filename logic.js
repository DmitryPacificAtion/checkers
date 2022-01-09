const CONSTANTS = {
  FRIEND: 'friend',
  ALIEN: 'alien',
  READY: 'ready',
  START_MOVEMENT: 'start-movement',
  END_MOVEMENT: 'end-movement',
  POSSIBLE_ATTACK: 'possible-attack',
  POSSIBLE_STEP: 'possible-step',
};

const players = {
  0: CONSTANTS.FRIEND,
  1: CONSTANTS.ALIEN,
  [CONSTANTS.FRIEND]: 0,
  [CONSTANTS.ALIEN]: 1
};

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
  //   'f4', 'b8', 'd8', 'f8', 'h8',
  //   'a7', 'c7', 'e7', 'g7',
  //   'b6', 'd6', 'f6', 'h6',
  // ]
};
const state = {
  fields: null,
  selectedCheckerId: null,
  kickedOffCheckerIds: [],
  turn: players[0],
};

const _do = (...args) => f => f(...args);
const getCharAt = p => p.toString().charCodeAt();
const getCoords = id => id.split('').map(getCharAt);
const getCharFrom = n => String.fromCharCode(n);
const getFieldById = id => state.fields[id];

const add = ([x, y]) => x + y;
const div = ([x, y]) => {
  if (Array.isArray(x) && Array.isArray(y)) {
    const [ firstX, lastX ] = x;
    const [ firstY, lastY ] = y;
    return [div([firstX, firstY]), div([lastX, lastY])];
  }
  return x - y;
};

const addWith = ([x, y], n) => [add([x, n]), add([y, n])];
const divWith = ([x, y], n) => [div([x, n]), div([y, n])];
const oppositePlayer = () => players[+!players[state.turn]];
const hasOpposite = (field) => field?.lastChild?.classList.contains(oppositePlayer());
const topRight = (coords, n) => addWith(coords, n).map(getCharFrom).join('');
const topLeft = ([x, y], n) => [div([x, n]), add([y, n])].map(getCharFrom).join('');
const bottomLeft = (coords, n) => divWith(coords, n).map(getCharFrom).join('');
const bottomRight = ([x, y], n) => [add([x, n]), div([y, n])].map(getCharFrom).join('');

const clearPrevSelectedField = () => {
  Object.values(state.fields).forEach(step => {
    if (step) {
      step.removeEventListener('click', moveHandler);
      step.classList.remove(CONSTANTS.READY, CONSTANTS.POSSIBLE_STEP, CONSTANTS.POSSIBLE_ATTACK)
    }
  });
  state.kickedOffCheckerIds = [];
  state.selectedCheckerId = null;
};

const moveHandler = ({ target }) => {
  const { selectedCheckerId, fields } = state;
  const source = fields[selectedCheckerId];
  const enemyId = state.kickedOffCheckerIds[0];
  const enemy = state.fields[enemyId];
  if (enemy) {
    state.fields[enemyId].lastChild.classList.add('remove-checker');
    setTimeout(() => state.fields[enemyId].innerHTML = '', 500);
  }

  target.appendChild(source.lastChild);
  clearPrevSelectedField();
  state.turn = oppositePlayer();

  console.log('state', state);
};

const directions = {
  tr: topRight,
  tl: topLeft,
  bl: bottomLeft,
  br: bottomRight
};

const convertDiffToDirection = ([x, y]) => {
  if (x > 0 && y > 0) {
    return directions.tr;
  } else if (x < 0 && y > 0) {
      return directions.tl;
  } else if (x > 0 && y < 0) {
      return directions.br;
  } else if (x < 0 && y < 0) {
      return directions.bl;
  } else {
    return;
  }
}

const defineNextCell = (field) => {
  const { id: fieldId } = field;
  const nextCell = getFieldById(
    convertDiffToDirection(
      directions.diff(fieldId, state.selectedCheckerId)
    )(getCoords(fieldId), 1)
  );

  if (nextCell && !nextCell.lastChild) {
    state.kickedOffCheckerIds.push(fieldId);
    return nextCell;
  }

  return null;
}

Object.defineProperty(directions, 'diff', {
  value: (a, b) => div([getCoords(a), getCoords(b)]),
});

const posibleNearbyIds = coords => n =>
  Object.values(directions).map(_do(coords, n)).filter(ch => state.fields[ch]);

const highlightPossibleSteps = steps => {
  state.kickedOffCheckerIds.map(id => state.fields[id].classList.add(CONSTANTS.POSSIBLE_ATTACK));

  return steps.map(step => {
    step.addEventListener('click', moveHandler)
    step.classList.add(CONSTANTS.POSSIBLE_STEP);
    return step;
  })}

const definePossibleSteps = () => {
  const { selectedCheckerId: id } = state;
  const posibleStepsIds = posibleNearbyIds(getCoords(id))(1)
    .map(stedId => getFieldById(stedId))
    .filter(f => f)
    .map(field => {
        if (field.lastChild) {
          const enemy = hasOpposite(field);
          return enemy ? defineNextCell(field) : null;
        }

      return field;
    })
    .filter(f => f);

  // Add 'highlight' function and transform 'posibleSteps' to functor
  // Object.defineProperty(posibleSteps, 'highlight', {
  //   value: () => {
  //     return highlightPossibleSteps(posibleSteps);
  //   }
  // });

  return highlightPossibleSteps(posibleStepsIds);
};

const createChecker = (name, index) => {

  const onClick = ({ target }) => {
    const { parentNode: cell } = target;
    if (state.fields[state.selectedCheckerId]) {
      clearPrevSelectedField();
    }
    state.selectedCheckerId = cell.id;

    if(target.dataset[state.turn]) {
      console.time('select-checker');
      cell.classList.add(CONSTANTS.READY);
      definePossibleSteps();
      console.timeEnd('select-checker');
    }
  };

  const div = document.createElement('div');
  div.addEventListener('click', onClick);

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
  state.fields = Object.values(document.querySelectorAll('.cell.dark'))
    .reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

  Object.values(state.fields).forEach((field, index) => {
    putCheckerToTheBoard(CONSTANTS.FRIEND, field, index);
    putCheckerToTheBoard(CONSTANTS.ALIEN, field, index);
  });
};

(function() {
  init();
})()