const defaultFriends = [
  'a1', 'c1', 'e1', 'g1',
  'b2', 'd2', 'f2', 'h2',
  'a3', 'c3', 'e3', 'g3',
];

function setCheckers() {
  const fields = document.querySelectorAll('[id]');
  console.log('init', fields);

  fields.forEach(field => {
    // const id = field.id;
    console.log('field', field);
  })
};

(function() {
  setCheckers();
})()