export const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
export const is = x => x;
export const isEquals = x => y => x === y;
export const Identity = value => ({
  map: fn => Identity(fn(value))
});

export const logger = label => value => {
  console.log(`${ label }: ${ value }`);
  return value;
}
export const curry = (f, arr = []) => (...args) => (
  a => a.length === f.length ?
    f(...a) :
    curry(f, a)
)([...arr, ...args])

export const add = x => y => x + y;
export const div = x => y => x - y

export const map = f => arr => arr.map(f);
export const filter = f => arr => arr.filter(f);
// export const split = pattern => string => string.split(pattern);
export const join = pattern => arr => arr.join(pattern);
