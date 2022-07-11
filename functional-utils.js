const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const is = x => x;
const isEquals = x => y => x === y;
const Identity = value => ({
  map: fn => Identity(fn(value))
});

const logger = label => value => {
  console.log(`${ label }: ${ value }`);
  return value;
}
const curry = (f, arr = []) => (...args) => (
  a => a.length === f.length ?
    f(...a) :
    curry(f, a)
)([...arr, ...args])

const add = x => y => x + y;
const div = x => y => x - y

const map = f => arr => arr.map(f);
const filter = f => arr => arr.filter(f);
// const split = pattern => string => string.split(pattern);
const join = pattern => arr => arr.join(pattern);
