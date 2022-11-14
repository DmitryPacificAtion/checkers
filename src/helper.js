import { pipe, isEquals, add, div, map, join } from './functional-utils';

export const CONSTANTS = {
  FRIEND: 'friend',
  ALIEN: 'alien',
  READY: 'ready',
  QUEEN: 'queen',
  POSSIBLE_ATTACK: 'possible-attack',
  POSSIBLE_STEP: 'possible-step',
};

export const players = {
  0: CONSTANTS.FRIEND,
  1: CONSTANTS.ALIEN,
  [CONSTANTS.FRIEND]: 0,
  [CONSTANTS.ALIEN]: 1,
};

export const QUEEN_FOR_ALIEN_INDEXES = ['a1', 'c1', 'e1', 'g1'];
export const QUEEN_FOR_FRIEND_INDEXES = ['b8', 'd8', 'f8', 'h8'];

export const getFieldsHTML = () =>
  Object.values(document.querySelectorAll('.cell'));
export const getFieldsObject = () =>
  getFieldsHTML().reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
export const getFieldById = (id) => getFieldsObject()[id];
export const getCharAt = (p) => p.toString().charCodeAt();
export const getCoordinates = (id) => id.split('').map(getCharAt);
export const getCharFrom = (n) => String.fromCharCode(n);
export const oppositePlayer = (turn) => players[+!players[turn]];
export const getTurn = () => {
  const { turn } = document.getElementById('turn').dataset;
  return turn;
};
export const clearPossibleStepsSelection = () => {
  document.querySelectorAll(`.${CONSTANTS.POSSIBLE_STEP}`).forEach((cell) => {
    cell.classList.remove(CONSTANTS.POSSIBLE_STEP);
    cell.onclick = null;
  });
  document.querySelectorAll(`.${CONSTANTS.POSSIBLE_ATTACK}`).forEach((cell) => {
    cell.classList.remove(CONSTANTS.POSSIBLE_ATTACK);
  });
};

export const clearReadyField = () => {
  document.querySelector('.ready')?.classList.remove(CONSTANTS.READY);
};
export const setTurn = (turn) => {
  document.getElementById('turn').setAttribute('data-turn', turn);
};
export const setPointers = (turn) => {
  document
    .querySelectorAll(`.${turn}`)
    .forEach((cell) => cell.classList.add('pointer'));
};
export const clearPointers = () => {
  document
    .querySelectorAll('.pointer')
    .forEach((cell) => cell.classList.remove('pointer'));
};
export const isWinner = (turn) => {
  const alients = document.querySelectorAll(`.${oppositePlayer(turn)}`);
  return alients.length === 0;
};
export const showWinnerModal = (turn) => {
  const color = isEquals(turn)(CONSTANTS.FRIEND) ? 'White' : 'Black';
  alert(`${color} player is winner!`);
};

export const getInnerCell = (cell) => cell.firstChild;
export const isCellEmpty = (cell) =>
  cell ? getInnerCell(cell) === null : true;
export const hasFriend = (cell) =>
  isCellEmpty(cell) ? false : getInnerCell(cell)?.classList.contains(getTurn());

export const hasEnemy = (cell) => {
  const cond = isCellEmpty(cell)
    ? false
    : !getInnerCell(cell)?.classList.contains(getTurn());
  return cond;
};

export const isCellEmptyNew = (cell) => {
  return (
    cell &&
    !(
      cell.classList.contains(CONSTANTS.FRIEND) ||
      cell.classList.contains(CONSTANTS.ALIEN)
    )
  );
};

export const hasFriendNew = (cell) =>
  isCellEmpty(cell) ? false : isEquals(cell?.classList.value)(getTurn());

export const hasEnemyNew = (cell) =>
  isCellEmpty(cell) ? false : !isEquals(cell?.classList.value)(getTurn());

export const highlightCellForMove = (step) => {
  step.classList?.add(CONSTANTS.POSSIBLE_STEP);
};

export const highlightCellForAttack = (step) => {
  step.classList.add(CONSTANTS.POSSIBLE_ATTACK);
  return step;
};

export const topRight = (n) =>
  pipe(getCoordinates, map(add(n)), map(getCharFrom), join(''));

export const topLeft = (n) =>
  pipe(
    getCoordinates,
    ([x, y]) => [div(x)(n), add(y)(n)],
    map(getCharFrom),
    join('')
  );

export const bottomLeft = (n) =>
  pipe(
    getCoordinates,
    map((i) => div(i)(n)),
    map(getCharFrom),
    join('')
  );

export const bottomRight = (n) =>
  pipe(
    getCoordinates,
    ([x, y]) => [add(x)(n), div(y)(n)],
    map(getCharFrom),
    join('')
  );
export const directions = {
  tr: topRight,
  tl: topLeft,
  bl: bottomLeft,
  br: bottomRight,
  all: [topRight, topLeft, bottomLeft, bottomRight],
  forward: [topRight, topLeft],
  backward: [bottomLeft, bottomRight],
};

export const convertDiffToDirection = (x) => (y) => {
  if (x > 0 && y > 0) {
    return directions.tr;
  }
  if (x < 0 && y > 0) {
    return directions.tl;
  }
  if (x > 0 && y < 0) {
    return directions.br;
  }
  if (x < 0 && y < 0) {
    return directions.bl;
  }
  return;
};

Object.defineProperty(directions, 'diff', {
  value: (from, to) => {
    const [fromX, fromY] = getCoordinates(from);
    const [toX, toY] = getCoordinates(to);
    const steps = div(fromX)(toX);

    return [convertDiffToDirection(steps)(div(fromY)(toY)), steps];
  },
});

// const lookForOneStep = curry(1);
// const lookForTwoSteps = curry(2);

export const isQueen = (target) => target.classList.contains(CONSTANTS.QUEEN);

export const shouldUpgrateToQueen = (target) => {
  const friendCheck =
    target.classList.contains(CONSTANTS.FRIEND) &&
    QUEEN_FOR_FRIEND_INDEXES.includes(target.parentNode.id);
  const ailenCheck =
    target.classList.contains(CONSTANTS.ALIEN) &&
    QUEEN_FOR_ALIEN_INDEXES.includes(target.parentNode.id);

  if (friendCheck || ailenCheck) {
    return true;
  }
  return false;
};

export const upgradeToQueen = (target) => {
  target.classList.add(CONSTANTS.QUEEN);
};

export const updateScore = () => {
  const total = document.querySelectorAll('.score-board__in-game');
  const friends = document.querySelectorAll(`.${CONSTANTS.FRIEND}`);
  const aliens = document.querySelectorAll(`.${CONSTANTS.ALIEN}`);
  total[0].innerText = friends.length;
  total[1].innerText = aliens.length;
};

// module.exports = {
//   CONSTANTS,
//   players,
//   QUEEN_FOR_ALIEN_INDEXES,
//   QUEEN_FOR_FRIEND_INDEXES,
//   getFieldsHTML,
//   getFieldsObject,
//   getFieldById,
//   getCharAt,
//   getCoordinates,
//   getCharFrom,
//   oppositePlayer,
//   getTurn,
//   clearPossibleStepsSelection,
//   clearReadyField,
//   setTurn,
//   setPointers,
//   clearPointers,
//   isWinner,
//   showWinnerModal,
//   getInnerCell,
//   isCellEmpty,
//   hasFriend,
//   hasEnemy,
//   isCellEmptyNew,
//   hasFriendNew,
//   hasEnemyNew,
//   highlightCellForMove,
//   highlightCellForAttack,
//   topRight,
//   topLeft,
//   bottomLeft,
//   bottomRight,
//   directions,
//   convertDiffToDirection,
//   isQueen,
//   shouldUpgrateToQueen,
//   upgradeToQueen,
//   updateScore,
// };
