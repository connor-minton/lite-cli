const { isObjectLike } = require('../../../src/sak');

test('isObjectLike: true if object-like', () => {
  class Foo { };
  function func() {};
  const obj = {a:1};
  const foo = new Foo();

  expect(isObjectLike(Foo)).toBe(true);
  expect(isObjectLike(func)).toBe(true);
  expect(isObjectLike(obj)).toBe(true);
  expect(isObjectLike(foo)).toBe(true);
});

test('isObjectLike: false if not object-like', () => {
  expect(isObjectLike(3)).toBe(false);
  expect(isObjectLike('hi')).toBe(false);
  expect(isObjectLike(null)).toBe(false);
  expect(isObjectLike(undefined)).toBe(false);
});
