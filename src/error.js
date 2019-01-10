class LiteCliError extends Error { }
class ParseError extends LiteCliError { }
class InvalidConfig extends LiteCliError { }

module.exports = {
  LiteCliError,
  ParseError,
  InvalidConfig
};
