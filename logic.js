const FRIEND = 'friend';
const ALIEN = 'alien';

const defaultArrangements = {
  [FRIEND]: [
    'a1', 'c1', 'e1', 'g1',
    'b2', 'd2', 'f2', 'h2',
    'a3', 'c3', 'e3', 'g3',
  ],
  [ALIEN]: [
    'b8', 'd8', 'f8', 'h8',
    'a7', 'c7', 'e7', 'g7',
    'b6', 'd6', 'f6', 'h6',
  ]
};
const state = {
  fields: null,
  turn: FRIEND,
};

const _do = (...args) => f => f(...args);

const getNewChar = n => String.fromCharCode(n);

const topRight = (coords, n) =>
  coords.map(p => getNewChar(p.charCodeAt() + n)).join('');

const topLeft = ([x, y], n) => 
  [getNewChar(x.charCodeAt() + n), getNewChar(y.charCodeAt() - n)].join('');

const bottomLeft = (coords, n) =>
  coords.map(p => getNewChar(p.charCodeAt() - n)).join('');

const bottomRight = ([x, y], n) =>
  [getNewChar(x.charCodeAt() - n), getNewChar(y.charCodeAt() + n)].join('');

const directions = {
  tr: topRight,
  tl: topLeft,
  bl: bottomLeft,
  br: bottomRight,
};

const posibleNearbyIds = (coords) => (n) => Object.values(directions).map(_do(coords, n));

const highlightPossibleSteps = steps => steps.map(step => step.classList.add('possible-step'));

const calculatePossibleSteps = (id) => {
  // const res = variants.map(id => state.fields.find(i => i.id === id)).filter(j => j && !j.hasChildNodes());
  const res = posibleNearbyIds(id.split(''))(1)
    .map(id => document.getElementById(id))
    .filter(i => i && !i.lastChild?.classList?.contains(state.turn));
    // .map(i => {
    //   console.log('i', i);
    // });
  
  res['highlight'] = () => highlightPossibleSteps(res);

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