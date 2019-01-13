const { touch } = require('../src/sak');

const obj = {
  a: {
    b: {
      c: {
        d: 3
      }
    }
  }
};

touch(obj, 'a.b.c');
console.log(JSON.stringify(obj, null, 2));
