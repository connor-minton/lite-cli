const { get } = require('../../../src/sak');

test('get: gets single level object property', () => {
  const obj = {a:1, b:2};
  expect(get(obj, 'a')).toBe(1);
  expect(get(obj, 'b')).toBe(2);
});

test('get: returns undefined if single-level property not found', () => {
  const obj = {a:1, b:2};
  expect(get(obj, 'c')).toBeUndefined();
});

test('get: gets two-level object property', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(get(obj, 'b.c')).toBe(1234);
});

test('get: returns undefined for second-level property not found', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(get(obj, 'b.d')).toBeUndefined();
});

test('get: returns undefined for second-level property where first level object does not exist', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(get(obj, 'e.x')).toBeUndefined();
});

test('get(obj, arr): gets single level object property', () => {
  const obj = {a:1, b:2};
  expect(get(obj, ['a'])).toBe(1);
  expect(get(obj, ['b'])).toBe(2);
});

test('get(obj, arr): returns undefined if single-level property not found', () => {
  const obj = {a:1, b:2};
  expect(get(obj, ['c'])).toBeUndefined();
});

test('get(obj, arr): gets two-level object property', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(get(obj, ['b','c'])).toBe(1234);
});

test('get(obj, arr): returns undefined for second-level property not found', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(get(obj, ['b','d'])).toBeUndefined();
});

test('get(obj, arr): returns undefined for second-level property where first level object does not exist', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(get(obj, ['e','x'])).toBeUndefined();
});
