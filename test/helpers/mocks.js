module.exports = {
  process: {
    exit: jest.fn()
  },

  console: {
    log: jest.fn(console.log.bind(console, '[MOCK LOG]')),
    error: jest.fn(console.error.bind(console, '[MOCK ERROR]'))
  }
};
