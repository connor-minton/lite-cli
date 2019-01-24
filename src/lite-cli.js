const { pick } = require('./sak');
const OptionParser = require('./option-parser');
const { LiteCliError, ParseError } = require('./error');

class LiteCli {
  constructor(config) {
    this._config = config || {};
    this._parser = new OptionParser(pick(this._config, ['options', 'arguments']));
  }

  parse(argv) {
    if (!Array.isArray(argv))
      throw new LiteCliError(`'argv' must be an Array`);

    try {
      return this._parser.parse(argv.slice(2));
    }
    catch (err) {
      if (err instanceof ParseError) {
        console.error(err.message);
        process.exit(1);
      }
      else throw err;
    }
  }
}

module.exports = LiteCli;
