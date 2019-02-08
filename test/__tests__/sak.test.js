const { has } = require('../../src/sak');

test('sak#has: handles single level object has property', () => {
  const obj = {a:1, b:2};
  expect(has(obj, 'a')).toBe(true);
});
