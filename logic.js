const defaultFriends = [
  'a1', 'c1', 'e1', 'g1',
  'b2', 'd2', 'f2', 'h2',
  'a3', 'c3', 'e3', 'g3',
];

const defaultAliens = [
  'b8', 'd8', 'f8', 'h8',
  'a7', 'c7', 'e7', 'g7',
  'b6', 'd6', 'f6', 'h6',
];

const handleClick = ({ target }) => {
  target.classList.add('animate');
};

function setCheckers() {
  const fields = document.querySelectorAll('[id]');

  fields.forEach((field, index) => {
    const checker = document.createElement('div');
    field.addEventListener('click', handleClick);
    if (defaultFriends.includes(field.id)) {
      checker.classList.add('friend');
      checker.setAttribute('data-friend', index);
      field.appendChild(checker);
      return;
    }
    if (defaultAliens.includes(field.id)) {
      checker.classList.add('alien');
      checker.setAttribute('data-alien', index);
      field.appendChild(checker);
    }
  })
};

(function() {
  setCheckers();
})()