let user = {
  name: "John"
};

function wrap(target) {
  return new Proxy(target, {
     get: (target, property, receiver) => {
      if (!(property in target)) {
        throw new ReferenceError('Property does not exist!')
      }
      
      return Reflect.get(target, property, receiver); // target[property]
     }
  });
}

user = wrap(user);

alert(user.name); // John
alert(user.age); // Error: 'Property does not exist!'



// <!-- --- --- --- --->

let array = [1, 2, 3];

array = new Proxy(array, {
  get: (arr, value, receiver) => {
    if (value < 0) {
      return arr[arr.length - (value * -1)]
    }
    return Reflect.get(arr, value, receiver);
  }
});

alert(array[-1] ); // 3
alert(array[-2] ); // 2


// <!-- --- --- --- --->
function makeObservable(target) {
  const handlers = [];

  console.log('handlers', handlers);
  target.observe = function(handler) {
    handlers.push(handler);
  };


  return new Proxy(target, {
    set: (target, property, value, receiver) => {
      const success = Reflect.set(target, property, value, receiver);
      if (success) {
        target[handlers].forEach(handler => handler(property, value));
      }
      return success;
    },
  })
}

let person = {};
person = makeObservable(person);

person.observe((key, value) => {
  console.log(`SET ${key}=${value}`);
});

person.name = "John"; // выводит: SET name=John
