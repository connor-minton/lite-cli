const { funkify } = require('../../../src/sak');

test('funkify(): returns a function when a function is given', () => {
  const inputFunc = function() { return 3; };
  const expectedFuncOutput = inputFunc();

  const outputFunc = funkify(inputFunc);

  expect(outputFunc()).toBe(expectedFuncOutput);
});

test('funkify(): returns a function that encapsulates the non-function value when called', () => {
  const tests = [
    3, 'hi', null, undefined, {hi: 'hi'}
  ];

  for (let val of tests) {
    const valFunc = funkify(val);
    expect(valFunc()).toEqual(val);
  }
});
