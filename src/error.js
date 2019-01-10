class LiteCliError extends Error { }
class ParseError extends LiteCliError { }

module.exports = {
  LiteCliError,
  ParseError
};
