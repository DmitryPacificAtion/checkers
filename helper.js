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

const getFieldsHTML = () => Object.values(document.querySelectorAll('.cell'));
const getFieldsObject = () => getFieldsHTML()
.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {});
const getFieldById = (id) => getFieldsObject()[id];
const getCharAt = p => p.toString().charCodeAt();
const getCoordinates = id => id.split('').map(getCharAt);
const getCharFrom = n => String.fromCharCode(n);
const getTurn = () => document.getElementById('turn').dataset.turn;
const getInnerCell = (cell) => cell.firstChild
const isCellEmpty = (cell) => cell ? getInnerCell(cell) === null : true
const hasFriend = (cell) => isCellEmpty(cell)
  ? false
  : getInnerCell(cell).classList.contains(CONSTANTS.FRIEND)

const hasEnemy = (cell) => isCellEmpty(cell)
  ? false
  : getInnerCell(cell).classList.contains(CONSTANTS.ALIEN)

const highlightCellForMove = step => {
  step.classList.add(CONSTANTS.POSSIBLE_STEP);
  return step;
}
const highlightCellForAttack = step => {
  step.classList.add(CONSTANTS.POSSIBLE_ATTACK);
  return step;
}

const _do = (...args) => f => f(...args);
const log = (v) => {
  console.log(v);
  return v;
}
const pipe = (...fns) => args => fns.reduce((y, f) => f(y), args);
const is = x => x;
const curry = (f, arr = []) => {
  console.log('curry', arr);
  return (...args) => (
    a => a.length === f.length ?
      f(...a) :
      curry(f, a)
  )([...arr, ...args])
};

const add = x => y => x + y;
const div = x => y => x - y;

const topRight = (coords, n) => coords.map(add(n)).map(getCharFrom).join('');
const topLeft = ([x, y], n) => [div(x)(n), add(y)(n)].map(getCharFrom).join('');
const bottomLeft = (coords, n) => coords.map(div(n)).map(getCharFrom).join('');
const bottomRight = ([x, y], n) => [add(x)(n), div(y)(n)].map(getCharFrom).join('');

const directions = {
  tr: topRight,
  tl: topLeft,
  bl: bottomLeft,
  br: bottomRight,
  all: [ topRight, topLeft, bottomLeft, bottomRight ],
  forward: [ topRight, topLeft ],
  backward: [ bottomLeft, bottomRight ],
};

const onMoveHandler = (fromId) =>({ target }) => {
  console.log('target', fromId, target);
  // const { selectedCheckerId, fields } = state;
  // const source = fields[selectedCheckerId];
  // const enemyId = state.kickedOffCheckerIds[0];
  // const enemy = state.fields[enemyId];
  // if (enemy) {
  //   state.fields[enemyId].lastChild.classList.add('remove-checker');
  //   setTimeout(() => state.fields[enemyId].innerHTML = '', 500);
  // }

  // target.appendChild(source.lastChild);
  // clearPrevSelectedField();
  // state.turn = oppositePlayer();
};

const onAtackHandler = onMoveHandler;