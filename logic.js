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
  turn: players[0],
};

const _do = (...args) => f => f(...args);
const getCharAt = p => p.toString().charCodeAt();
const getCoords = id => id.split('').map(getCharAt);
const getCharFrom = n => String.fromCharCode(n);
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

const createChecker = ([xCoord, yCoord], size) => {
  const div = document.createElement('div');
  const directionX = xCoord > 0 ? 'top' : 'bottom';
  const directionY = yCoord > 0 ? 'right' : 'left';
  div.setAttribute('class', state.turn);
  div.setAttribute('style', `position: absolute; ${directionX}: ${xCoord * size}px; ${directionY}: ${yCoord * size}px`);
  return div;
};

const oppositePlayer = () => players[+!players[state.turn]];

const topRight = (coords, n) => addWith(coords, n).map(getCharFrom).join('');
const topLeft = ([x, y], n) => [div([x, n]), add([y, n])].map(getCharFrom).join('');
const bottomLeft = (coords, n) => divWith(coords, n).map(getCharFrom).join('');
const bottomRight = ([x, y], n) => [add([x, n]), div([y, n])].map(getCharFrom).join('');

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

Object.defineProperty(directions, 'diff', {
  value: (a, b) => div([getCoords(a), getCoords(b)]),
});

const moveHandler = parent => ({ target }) => {
  const src = parent.querySelector(`.${state.turn}`);
  src.classList.remove(CONSTANTS.READY);
  src.classList.add(CONSTANTS.START_MOVEMENT);
  target.classList.add(CONSTANTS.END_MOVEMENT);
  const checker = createChecker(directions.diff(parent.id, target.id), target.clientWidth);
  target.appendChild(checker);
  console.log('scr, target', parent, src, target);
};

const posibleNearbyIds = (coords) => (n) => Object.values(directions).map(_do(coords, n));

const highlightPossibleSteps = steps => steps.map(step => {
  step?.classList?.add(CONSTANTS.POSSIBLE_STEP);
  return step;
});

const calculatePossibleSteps = (id) => {
  // const res = variants.map(id => state.fields.find(i => i.id === id)).filter(j => j && !j.hasChildNodes());
  const posibleSteps = posibleNearbyIds(getCoords(id))(1)
    .map(id => document.getElementById(id))
    .filter(i => i && !i.lastChild?.classList?.contains(state.turn))
    .map(i => {
      const hasOpposite = i.lastChild?.classList?.contains(oppositePlayer());
      if (hasOpposite) {
        const defineNextDirection = convertDiffToDirection(directions.diff(i.id, id));
        const definedNextId = defineNextDirection(getCoords(i.id), 1);
        const nextCell = document.getElementById(definedNextId);
        nextCell && i.classList.add(CONSTANTS.POSSIBLE_ATTACK);
        return nextCell
      }
      return i;
    })
    .filter(i => i);

  // Add 'highlight' function and transform 'res' to functor
  Object.defineProperty(posibleSteps, 'highlight', {
    value: () => {
      return highlightPossibleSteps(posibleSteps);
    }
  });

  return posibleSteps;
};

const handleClick = ({ target }) => {
  const { parentNode: parent } = target;

  if(parent.classList.contains(CONSTANTS.READY)) {
    parent.classList.remove(CONSTANTS.READY)
    state.fields.forEach(field => field.classList.remove(CONSTANTS.POSSIBLE_STEP, CONSTANTS.POSSIBLE_ATTACK));
    return;
  }

  if(target.dataset[state.turn]) {
    console.time('select-checker');
    state.fields.forEach(field => {
      field.classList.remove(CONSTANTS.READY, CONSTANTS.POSSIBLE_STEP, CONSTANTS.POSSIBLE_ATTACK);
      field.removeEventListener('click', moveHandler(parent));
    });
    parent.classList.add(CONSTANTS.READY);
    const posibleSteps = calculatePossibleSteps(parent.id).highlight();
    posibleSteps.map(step => step.addEventListener('click', moveHandler(parent)));
    console.timeEnd('select-checker');
  }
};

const putCheckerToTheBoard = (name, field, index) => {
  if (defaultArrangements[name].includes(field.id)) {
    const checker = document.createElement('div');
    checker.addEventListener('click', handleClick);

    checker.classList.add(name);
    checker.setAttribute(`data-${name}`, index);
    field.appendChild(checker);
  }
};

function init() {
  console.time('init');
  state.fields = Object.values(document.querySelectorAll('[id]'));

  state.fields.forEach((field, index) => {
    putCheckerToTheBoard(CONSTANTS.FRIEND, field, index);
    putCheckerToTheBoard(CONSTANTS.ALIEN, field, index);
  })
  console.timeEnd('init');
};

(function() {
  init();
})()