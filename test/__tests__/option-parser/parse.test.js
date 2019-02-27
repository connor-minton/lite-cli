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

test('parse: helpFlags: returns "help" when a help flag is encountered', () => {
  const hConfig = {
    helpFlags: ['h']
  };
  const hStrConfig = {
    helpFlags: 'h'
  };
  const hHHelpConfig = {
    helpFlags: ['h', 'H', 'help']
  }

  const tests = [
    {
      config: hConfig,
      input: [ '-h', 'hi' ],
      output: 'help'
    },
    {
      config: hStrConfig,
      input: [ '-h', 'hi' ],
      output: 'help'
    },
    {
      config: hHHelpConfig,
      input: [ '-h', 'hi' ],
      output: 'help'
    },
    {
      config: hHHelpConfig,
      input: [ '-H', 'hi' ],
      output: 'help'
    },
    {
      config: hHHelpConfig,
      input: [ '--help', 'hi' ],
      output: 'help'
    }
  ];

  for (let {config, input, output} of tests) {
    const parser = new OptionParser(config);
    expect(parser.parse(input)).toEqual(output);
  }
});

test('parse: defaults type to "string" when !type and nargs > 0', () => {
  const tests = [
    {
      config: {
        options: {
          f: { nargs: 1 }
        }
      },
      input: [ '-f', '1234' ],
      output: {
        _: [],
        f: '1234'
      }
    },
    {
      config: {
        options: {
          f: { nargs: 2 }
        }
      },
      input: [ '-f', 'asdf', '1234' ],
      output: {
        _: [],
        f: [ 'asdf', '1234' ]
      }
    },
    {
      config: {
        options: {
          files: { nargs: 2 }
        }
      },
      input: [ 'pos1', '--files', 'a.json', 'b.json', 'pos2' ],
      output: {
        _: [ 'pos1', 'pos2' ],
        files: [ 'a.json', 'b.json' ]
      }
    }
  ];

  for (let {config, input, output} of tests) {
    const parser = new OptionParser(config);
    expect(parser.parse(input)).toEqual(output);
  }
});
