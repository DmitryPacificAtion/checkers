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
  turn: FRIEND
};

const handleClick = ({ target }) => {
  const parent = target.parentNode;
  if(parent.classList.contains('ready')) {
    return;
  }
  state.fields.forEach(field => field.classList.remove('ready'));
  if(target.dataset[state.turn]) {
    parent.classList.add('ready');
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
  state.fields = document.querySelectorAll('[id]');

  state.fields.forEach((field, index) => {
    putCheckerToTheBoard(FRIEND, field, index);
    putCheckerToTheBoard(ALIEN, field, index);
  })
};

(function() {
  init();
})()