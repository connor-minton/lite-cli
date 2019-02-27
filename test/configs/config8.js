module.exports = {
  help: 'usage: blah blah, options: blah blah',
  helpFlags: [ 'h', '?' ],
  versionFlags: [ 'v', 'V', '--version' ],
  name: 'lite-cli',
  usage: 'lite-cli [-n <N>] arg1 arg2',
  description: 'Does something cool with arg1 and arg2.',
  options: {
    n: {
      type: 'number',
      nargs: 1
    }
  }
};
