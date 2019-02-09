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

test('parse: zero config: the common version flags are not given special treatment', () => {
  const tests = [
    {
      input: [ '-v', 'hi' ],
      output: { _: ['hi'], v: true }
    },
    {
      input: [ '-V', 'hi' ],
      output: { _: ['hi'], V: true }
    },
    {
      input: [ '--version', 'hi' ],
      output: { _: ['hi'], version: true }
    }
  ];

  for (let {input, output} of tests) {
    const parser = new OptionParser();
    expect(parser.parse(input)).toEqual(output);
  }
});

test('parse: versionFlags: returns "version" when a version flag is encountered', () => {
  const vConfig = {
    versionFlags: ['v']
  };
  const vStrConfig = {
    versionFlags: 'v'
  };
  const vVVersionConfig = {
    versionFlags: ['v', 'V', 'version']
  }

  const tests = [
    {
      config: vConfig,
      input: [ '-v', 'hi' ],
      output: 'version'
    },
    {
      config: vStrConfig,
      input: [ '-v', 'hi' ],
      output: 'version'
    },
    {
      config: vVVersionConfig,
      input: [ '-v', 'hi' ],
      output: 'version'
    },
    {
      config: vVVersionConfig,
      input: [ '-V', 'hi' ],
      output: 'version'
    },
    {
      config: vVVersionConfig,
      input: [ '--version', 'hi' ],
      output: 'version'
    }
  ];

  for (let {config, input, output} of tests) {
    const parser = new OptionParser(config);
    expect(parser.parse(input)).toEqual(output);
  }
});
