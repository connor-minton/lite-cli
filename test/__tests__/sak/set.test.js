const { set } = require('../../../src/sak');

test('set: just give up on a non-object', () => {
  const undef = undefined;
  const num = 3;
  const arr = [];

  set(undef, 'a', 42);
  set(num, 'a', 42);
  set(arr, 'length', 42);

  expect(num.a).not.toBe(42);
  expect(arr.length).not.toBe(42);
});

test('set: set first level props on an object', () => {
  const obj = {};
  const expected = {a:1, b:2, c:3};

  set(obj, 'a', 1);
  set(obj, 'b', 2);
  set(obj, 'c', 3);

  expect(obj).toEqual(expected);
});

test('set: set nested props on an object', () => {
  const obj = {};
  const expected = {
    a: 1,
    nest: {
      b: 2,
      nest: {
        c: 3
      }
    }
  };

  set(obj, 'a', 1);
  set(obj, 'nest.b', 2);
  set(obj, 'nest.nest.c', 3);

  expect(obj).toEqual(expected);
});
