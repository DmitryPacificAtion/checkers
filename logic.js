const FRIEND = 'friend';
const ALIEN = 'alien';

const players = {
  0: FRIEND,
  1: ALIEN,
  [FRIEND]: 0,
  [ALIEN]: 1
};

const defaultArrangements = {
  [FRIEND]: [
    'a7', 'g7', 'e1',
    'b2', 'h2',
  ],
  [ALIEN]: [
    'b8', 'f8', 'h8',
    'b6', 'f6', 'h6',
    'a3', 'c3', 'f2',
    'a1', 'c1', 'g1'
  ],
  // [FRIEND]: [
  //   'a1', 'c1', 'e1', 'g1',
  //   'b2', 'd2', 'f2', 'h2',
  //   'a3', 'c3', 'e3', 'g3',
  // ],
  // [ALIEN]: [
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

const convertToDirections = ([x, y]) => {
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
  value: (a, b) => convertToDirections(div([getCoords(a), getCoords(b)])),
});

const posibleNearbyIds = (coords) => (n) => Object.values(directions).map(_do(coords, n));

const highlightPossibleSteps = steps => steps.map(step => step?.classList?.add('possible-step'));

const calculatePossibleSteps = (id) => {
  // const res = variants.map(id => state.fields.find(i => i.id === id)).filter(j => j && !j.hasChildNodes());
  const res = posibleNearbyIds(getCoords(id))(1)
    .map(id => document.getElementById(id))
    .filter(i => i && !i.lastChild?.classList?.contains(state.turn))
    // .map(i => i.lastChild?.classList?.contains(state.turn));
    .map(i => {
      const hasOpposite = i.lastChild?.classList?.contains(oppositePlayer());
      if (hasOpposite) {
        // TDB check nex one behind the enemy
        const moveForward = directions.diff(i.id, id);
        const moveToId = moveForward(getCoords(i.id), 1);
        const nextCell = document.getElementById(moveToId);
        nextCell && i.classList.add('possible-attack');
        return nextCell;
      }
      return i;
    });

  // Add 'highlight' function and transform 'res' to functor
  Object.defineProperty(res, 'highlight', {
    value: () => highlightPossibleSteps(res),
  });

  return res;
};

const handleClick = ({ target }) => {
  const { parentNode: parent } = target;

  if(parent.classList.contains('ready')) {
    parent.classList.remove('ready')
    state.fields.forEach(field => field.classList.remove('possible-step', 'possible-attack'));
    return;
  }

  if(target.dataset[state.turn]) {
    console.time('select-checker');
    state.fields.forEach(field => {
      field.classList.remove('ready', 'possible-step', 'possible-attack');
    });
    parent.classList.add('ready');
    calculatePossibleSteps(parent.id).highlight();
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
    putCheckerToTheBoard(FRIEND, field, index);
    putCheckerToTheBoard(ALIEN, field, index);
  })
  console.timeEnd('init');
};

(function() {
  init();
})()