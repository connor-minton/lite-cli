const { type } = require('../../../src/sak');

test('type: detects null', () => {
  expect(type(null)).toBe('null');
});

test('type: detects undefined', () => {
  let undef;
  let obj = {};
  expect(type(undef)).toBe('undefined');
  expect(type(void(0))).toBe('undefined');
  expect(type(undefined)).toBe('undefined');
  expect(type()).toBe('undefined');
  expect(type(obj.a)).toBe('undefined');
});

test('type: detects strings', () => {
  expect(type('hi')).toBe('string');
  expect(type('')).toBe('string');
  expect(type(new String('hi'))).toBe('string');
});

test('type: detects finite numbers', () => {
  expect(type(42)).toBe('number');
  expect(type(new Number(42))).toBe('number');
  expect(type(0)).toBe('number');
});

test('type: detects +/-Infinity and NaN', () => {
  expect(type(Infinity)).toBe('Infinity');
  expect(type(-Infinity)).toBe('-Infinity');
  expect(type(NaN)).toBe('NaN');
});

test('type: detects arrays', () => {
  expect(type([])).toBe('array');
  expect(type([1,2,3])).toBe('array');
  expect(type({length:3})).not.toBe('array');
});

test('type: detects functions', () => {
  function func() { };
  const arrowLambda = () => { };
  const anonLambda = function() { };
  const namedLambda = function named() { };
  class Foo { bar() { } };
  const foo = new Foo();

  expect(type(func)).toBe('function');
  expect(type(arrowLambda)).toBe('function');
  expect(type(anonLambda)).toBe('function');
  expect(type(namedLambda)).toBe('function');
  expect(type(Foo)).toBe('function');
  expect(type(foo.bar)).toBe('function');
});

test('type: detects objects that do not box primitives', () => {
  class Foo { a() { } };
  const foo = new Foo();
  const obj = { a: 1, b: 2 };

  expect(type(foo)).toBe('object');
  expect(type(obj)).toBe('object');
  expect(type(Foo)).not.toBe('object');
  expect(type(new Number(3))).not.toBe('object');
  expect(type(new String('hi'))).not.toBe('object');
});
