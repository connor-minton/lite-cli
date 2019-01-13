const { map } = require('../src/sak');

const arr = [
  { a: 5 },
  { b: 9 },
  { a: 4 }
];

console.log(map(arr, 'a'));
console.log(map(arr, ['a']));
console.log(map(arr, o => o.b));
