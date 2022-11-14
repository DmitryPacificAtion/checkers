const {
  is,
  isEquals,
  pipe,
  logger,
  add,
  div,
  map,
  filter,
  join,
} = require('../../src/functional-utils');

describe('Check pipe func', () => {
  test('works properly', () => {
    const a = (x) => x + 'a';
    const b = (x) => x + 'b';
    const c = (x) => x + 'c';
    expect(pipe(a, b, c)('d')).toBe('dabc');
  });
});

describe('Check is func', () => {
  test('works properly', () => expect(is('test')).toBe('test'));
});

describe('Check isEquals func', () => {
  test('Different strings', () => {
    expect(isEquals('a')('b')).toBe(false);
  });
  test('Different types', () => {
    expect(isEquals('2')(2)).toBe(false);
  });
  test('Same objects', () => {
    const a = {};
    const b = a;
    expect(isEquals(a)(b)).toBe(true);
  });
  test('Different objects', () => {
    const a = {};
    const b = {};
    expect(isEquals(a)(b)).toBe(false);
  });
  test('Same values', () => {
    expect(isEquals(2)(2)).toBe(true);
  });
});

describe('Check logger func', () => {
  test('works properly', () => expect(logger('test')('me')).toBe('me'));
});

describe('Check add func', () => {
  test('works properly', () => {
    expect(add(1)(2)).toBe(3);
  });
});

describe('Check div func', () => {
  test('works properly', () => {
    expect(div(3)(2)).toBe(1);
  });
});

describe('Check map func', () => {
  test('works properly', () => {
    const arr = [1, 2, 3]
    const res = map(add(1))(arr)
    console.log(res)
    expect(res).toStrictEqual([2, 3, 4]);
  });
});

describe('Check filter func', () => {
  test('works properly', () => {
    const arr = [1, 2, 3]
    expect(filter(i => i === 1)(arr)).toStrictEqual([1]);
  });
});

describe('Check join func', () => {
  test('works properly', () => {
    const arr = [1, 2, 3]
    expect(join(' - ')(arr)).toStrictEqual('1 - 2 - 3');
  });
});


// const { Given, Then } = require("@cucumber/cucumber");

// Given('User loaded the game', function () {
//   // Write code here that turns the phrase above into concrete actions
//   return 'pending';
// });

// Then('He shoould see the board', function () {
//   // Write code here that turns the phrase above into concrete actions
//   return 'pending';
// });
