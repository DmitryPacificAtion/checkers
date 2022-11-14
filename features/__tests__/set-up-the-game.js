const { is, isEquals } = require('../../src/functional-utils');

describe('Check is func', () => {
  test('is works properly', () => expect(is('test')).toBe('test'))
});

describe('Check isEquals func', () => {
  test('Different strings', () => {
    expect(isEquals('a')('b')).toBe(false)
  });
  test('Different types', () => {
    expect(isEquals('2')(2)).toBe(false)
  });
  test('Same objects', () => {
    const a = {};
    const b = a;
    expect(isEquals(a)(b)).toBe(true)
  });
  test('Different objects', () => {
    const a = {};
    const b = {};
    expect(isEquals(a)(b)).toBe(false)
  });
  test('Same values', () => {
    expect(isEquals(2)(2)).toBe(true)
  });
})

// const { Given, Then } = require("@cucumber/cucumber");

// Given('User loaded the game', function () {
//   // Write code here that turns the phrase above into concrete actions
//   return 'pending';
// });

// Then('He shoould see the board', function () {
//   // Write code here that turns the phrase above into concrete actions
//   return 'pending';
// });
