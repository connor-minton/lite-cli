const { pick } = require('../src/sak');

let obj = {
  a: 3,
  b: 4,
  c: 5,
  d: 6
};

let arr = [
  0, 1, 2, 3, 4, 5
];

console.log(pick(obj, (k,v) => v === 4 || v === 6));
console.log(pick(obj, ['b','d']));
console.log(pick(arr, (i,e) => e === 3 || e === 5));
console.log(pick(arr, [3,5]));
