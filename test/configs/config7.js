module.exports = {
  version: () => require('../../package.json').version,
  name: 'lite-cli',
  usage: 'lite-cli [-n <N>] arg1 arg2',
  description: 'Does something cool with arg1 and arg2.',
  options: {
    n: {
      type: 'number',
      nargs: 1
    },
    v: {
      type: 'count'
    },
    'output-the-version': {
      type: 'version'
    }
  }
};
