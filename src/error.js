class LiteCliError extends Error { }
class ParseError extends LiteCliError { }
class InvalidConfigError extends LiteCliError { }

module.exports = {
  LiteCliError,
  ParseError,
  InvalidConfigError
};
