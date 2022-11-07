const CONSTANTS = {
  FRIEND: 'friend',
  ALIEN: 'alien',
  READY: 'ready',
  QUEEN: 'queen',
  POSSIBLE_ATTACK: 'possible-attack',
  POSSIBLE_STEP: 'possible-step',
};

const players = {
  0: CONSTANTS.FRIEND,
  1: CONSTANTS.ALIEN,
  [CONSTANTS.FRIEND]: 0,
  [CONSTANTS.ALIEN]: 1,
};

const QUEEN_FOR_ALIEN_INDEXES = ['a1', 'c1', 'e1', 'g1'];
const QUEEN_FOR_FRIEND_INDEXES = ['b8', 'd8', 'f8', 'h8'];

const getFieldsHTML = () => Object.values(document.querySelectorAll('.cell'));
const getFieldsObject = () =>
  getFieldsHTML().reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
const getFieldById = (id) => getFieldsObject()[id];
const getCharAt = (p) => p.toString().charCodeAt();
const getCoordinates = (id) => id.split('').map(getCharAt);
const getCharFrom = (n) => String.fromCharCode(n);
const oppositePlayer = (turn) => players[+!players[turn]];
const getTurn = () => {
  const { turn } = document.getElementById('turn').dataset;
  return turn;
};
const clearPossibleStepsSelection = () => {
  document.querySelectorAll(`.${CONSTANTS.POSSIBLE_STEP}`).forEach((cell) => {
    cell.classList.remove(CONSTANTS.POSSIBLE_STEP);
    cell.onclick = null;
  });
  document.querySelectorAll(`.${CONSTANTS.POSSIBLE_ATTACK}`).forEach((cell) => {
    cell.classList.remove(CONSTANTS.POSSIBLE_ATTACK);
  });
};

const clearReadyField = () => {
  document.querySelector('.ready')?.classList.remove(CONSTANTS.READY);
};
const setTurn = (turn) => {
  document.getElementById('turn').setAttribute('data-turn', turn);
};
const setPointers = (turn) => {
  document
    .querySelectorAll(`.${turn}`)
    .forEach((cell) => cell.classList.add('pointer'));
};
const clearPointers = () => {
  document
    .querySelectorAll('.pointer')
    .forEach((cell) => cell.classList.remove('pointer'));
};
const isWinner = (turn) => {
  const alients = document.querySelectorAll(`.${oppositePlayer(turn)}`)
  return alients.length === 0;
}
const showWinnerModal = (turn) => {
  const color = isEquals(turn)(CONSTANTS.FRIEND) ? 'White' : 'Black';
  alert(`${color} player is winner!`);
}
const endGame = () => {
  Object.values(document.querySelectorAll(`.${CONSTANTS.FRIEND}`)).forEach((cell) => {
    cell.onclick = null;
    cell.removeEventListener('click', onClickChecker);
  });
  Object.values(document.querySelectorAll(`.${CONSTANTS.ALIEN}`)).forEach((cell) => {
    cell.onclick = null;
    cell.removeEventListener('click', onClickChecker);
  });
  clearPointers();
  document.getElementById('give-up').removeEventListener('click', giveUp);
}
const giveUp = () => {
  showWinnerModal(oppositePlayer(getTurn()));
  clearReadyField();
  clearPossibleStepsSelection();
  endGame();
}

const getInnerCell = cell => cell.firstChild
const isCellEmpty = cell => cell ? getInnerCell(cell) === null : true
const hasFriend = cell => isCellEmpty(cell)
  ? false
  : getInnerCell(cell)?.classList.contains(getTurn())

const hasEnemy = cell => {
  const cond = isCellEmpty(cell)
  ? false
  : !getInnerCell(cell)?.classList.contains(getTurn())
  return cond; 
}

const isCellEmptyNew = (cell) => {
  return (
    cell &&
    !(
      cell.classList.contains(CONSTANTS.FRIEND) ||
      cell.classList.contains(CONSTANTS.ALIEN)
    )
  );
};

const hasFriendNew = (cell) =>
  isCellEmpty(cell) ? false : isEquals(cell?.classList.value)(getTurn());

const hasEnemyNew= (cell) =>
  isCellEmpty(cell) ? false : !isEquals(cell?.classList.value)(getTurn());

const highlightCellForMove = (step) => {
  step.classList?.add(CONSTANTS.POSSIBLE_STEP);
};

const highlightCellForAttack = (step) => {
  step.classList.add(CONSTANTS.POSSIBLE_ATTACK);
  return step;
};

const topRight = (n) =>
  pipe(getCoordinates, map(add(n)), map(getCharFrom), join(''));

const topLeft = (n) =>
  pipe(
    getCoordinates,
    ([x, y]) => [div(x)(n), add(y)(n)],
    map(getCharFrom),
    join('')
  );

const bottomLeft = (n) =>
  pipe(
    getCoordinates,
    map((i) => div(i)(n)),
    map(getCharFrom),
    join('')
  );

const bottomRight = (n) =>
  pipe(
    getCoordinates,
    ([x, y]) => [add(x)(n), div(y)(n)],
    map(getCharFrom),
    join('')
  );
const directions = {
  tr: topRight,
  tl: topLeft,
  bl: bottomLeft,
  br: bottomRight,
  all: [topRight, topLeft, bottomLeft, bottomRight],
  forward: [topRight, topLeft],
  backward: [bottomLeft, bottomRight],
};

const convertDiffToDirection = (x) => (y) => {
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

const isQueen = (target) => target.classList.contains(CONSTANTS.QUEEN)

const shouldUpgrateToQueen = (target) => {
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

const upgradeToQueen = (target) => {
  target.classList.add(CONSTANTS.QUEEN);
};
