const OptionParser = require('../../../src/option-parser');

test('parse: zero config: parses positional args without flags', () => {
  const parser = new OptionParser();
  const args = [ 'hello', 'world' ];
  const expected = { _: args };

  expect(parser.parse(args)).toEqual(expected);
});

test('parse: zero config: parses positional args and flags', () => {
  const tests = [
    {
      input: [ '-a' ],
      output: {
        _: [], a: true
      }
    },
    {
      input: [ '-a', 'hi' ],
      output: {
        _: [ 'hi' ], a: true
      }
    },
    {
      input: [ 'hi', '-a' ],
      output: {
        _: [ 'hi' ], a: true
      }
    },
    {
      input: [ '-b', 'hi', '--hello', 'yall' ],
      output: {
        _: [ 'hi', 'yall' ],
        b: true,
        hello: true
      }
    },
    {
      input: [ '-abc', 'woah', '-def', 'multiple flags?!' ],
      output: {
        _: [ 'woah', 'multiple flags?!' ],
        a: true, b: true, c: true,
        d: true, e: true, f: true
      }
    }
  ];

  for (let {input, output} of tests) {
    const parser = new OptionParser();
    expect(parser.parse(input)).toEqual(output);
  }
});
