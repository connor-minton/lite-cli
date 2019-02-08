const { has } = require('../../../src/sak');

test('has: handles single level object has property', () => {
  const obj = {a:1, b:2};
  expect(has(obj, 'a')).toBe(true);
});

test('has: handles single level object does not have property', () => {
  const obj = {a:1, b:2};
  expect(has(obj, 'c')).toBe(false);
});

test('has: handles two-level object has property', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(has(obj, 'b.c')).toBe(true);
});

test('has: handles two-level object does not have second-level property', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(has(obj, 'b.d')).toBe(false);
});

test('has: handles two-level object does not have second-level property where first level object does not exist', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(has(obj, 'e.x')).toBe(false);
});

test('has(obj, array): handles single level object has property', () => {
  const obj = {a:1, b:2};
  expect(has(obj, ['a'])).toBe(true);
});

test('has(obj, array): handles single level object does not have property', () => {
  const obj = {a:1, b:2};
  expect(has(obj, ['c'])).toBe(false);
});

test('has(obj, array): handles two-level object has property', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(has(obj, ['b','c'])).toBe(true);
});

test('has(obj, array): handles two-level object does not have second-level property', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(has(obj, ['b','d'])).toBe(false);
});

test('has(obj, array): handles two-level object does not have second-level property where first level object does not exist', () => {
  const obj = {
    a:1,
    b:{
      c: 1234
    }
  };
  expect(has(obj, ['e','x'])).toBe(false);
});

test('has: handles non-object first arg', () => {
  expect(has(undefined, 'a.b')).toBe(false);
  expect(has(null, 'a.b')).toBe(false);
});

test('has: array has length', () => {
  expect(has([], 'length')).toBe(true);
});
