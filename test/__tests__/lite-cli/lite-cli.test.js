const LiteCli = require('../../../src/lite-cli');
const mocks = require('../../helpers/mocks');

const worthlessArgs = [ 'node', 'script-name.js' ];

const configs = {
  customDescVersionHelp: require('../../configs/config7'),
  version: {
    version: 'v1.2.3'
  },
  versionFn: {
    version: () => 'v1.2.3'
  },
  help: {
    help: 'usage: blah blah, options: blah blah'
  },
  helpFn: {
    help: () => 'usage: blah blah, options: blah blah'
  },
  zero: {}
};

// mock logger and process in all of the CLI configs
for (let config of Object.values(configs)) {
  Object.assign(config, {
    logger: mocks.console,
    process: mocks.process
  });
}

test('parse(): zero-config: is just a passthrough to option parser', () => {
  const cli = new LiteCli(configs.zero);

  const tests = [
    {
      input: [ 'hello', 'world', '-hw', '--hello' ],
      output: {
        _: [ 'hello', 'world' ],
        h: true, w: true, hello: true
      }
    },
    {
      input: [],
      output: { _: [] }
    }
  ];

  for (let test of tests) {
    test.input = worthlessArgs.concat(test.input);
    expect(cli.parse(test.input)).toEqual(test.output);
  }
});

test('exitVersion(): writes version to stderr and exits', () => {
  const cliVersion = new LiteCli(configs.version);
  const cliVersionFn = new LiteCli(configs.versionFn);

  cliVersion.exitVersion();
  cliVersionFn.exitVersion();

  expect(mocks.process.exit.mock.calls.length).toBe(2);
  expect(mocks.process.exit.mock.calls[0][0]).toBe(0);
  expect(mocks.process.exit.mock.calls[1][0]).toBe(0);

  expect(mocks.console.log.mock.calls.length).toBe(2);
  // TODO: Surprise! It looks like LiteCli is writing onto the config object
  // that is passed into the constructor. This is why `configs.version.version`
  // is actually a function, as opposed to how it is defined as a string at the
  // top of the file. We need to make sure that LiteCli is making a deep copy
  // of the input config. Same for OptionParser, for good measure.
  expect(mocks.console.log.mock.calls[0][0]).toBe(configs.version.version());
  expect(mocks.console.log.mock.calls[1][0]).toBe(configs.versionFn.version());
});

test('exitHelp(): writes help to stderr and exits', () => {
  const cliHelp = new LiteCli(configs.help);
  const cliHelpFn = new LiteCli(configs.helpFn);

  cliHelp.exitHelp();
  cliHelpFn.exitHelp();

  expect(mocks.process.exit.mock.calls.length).toBe(2);
  expect(mocks.process.exit.mock.calls[0][0]).toBe(0);
  expect(mocks.process.exit.mock.calls[1][0]).toBe(0);

  expect(mocks.console.log.mock.calls.length).toBe(2);
  // TODO: Surprise! It looks like LiteCli is writing onto the config object
  // that is passed into the constructor. This is why `configs.version.version`
  // is actually a function, as opposed to how it is defined as a string at the
  // top of the file. We need to make sure that LiteCli is making a deep copy
  // of the input config. Same for OptionParser, for good measure.
  expect(mocks.console.log.mock.calls[0][0]).toBe(configs.help.help());
  expect(mocks.console.log.mock.calls[1][0]).toBe(configs.helpFn.help());
});
