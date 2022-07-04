const ingredients = new Map([
  ['carrot', 'carrot'],
  ['apple', 'apple'],
  ['peach', 'peach'],
  ['kiwi', 'kiwi'],
  ['banana', 'banana'],
]);

function getIngredients(ingredient) {
  return ingredients.get(ingredient) || 'lemon'
}


const vegetables = {
  carrot: 'carrot',
  apple: 'apple',
  peach: 'peach',
  kiwi: 'kiwi',
  banana: 'banana',
};


function proxifyIngredients(prop) {
  const proxiedVegatables = new Proxy(vegetables, {
     get: (target, property, receiver) => {
      if (!(property in target)) {
        return 'potato'
      }

      return Reflect.get(target, property, receiver); // ingredients.get(ingredient)
     }
  });
  return proxiedVegatables[prop]
}

const component = proxifyIngredients('lemon');
console.log(component);
