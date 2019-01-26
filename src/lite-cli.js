const { pick, set, type, get, has } = require('./sak');
const OptionParser = require('./option-parser');
const { LiteCliError, ParseError } = require('./error');

class LiteCli {
  constructor(config) {
    this._config = config || {};
    this._parser = new OptionParser(pick(this._config, ['options', 'arguments']));
    this._args = null;

    this._normalizeConfig();
  }

  parse(argv) {
    const parserConfig = this._parser.config;

    if (!Array.isArray(argv))
      throw new LiteCliError(`'argv' must be an Array`);

    try {
      this._args = this._parser.parse(argv.slice(2));
      if (this._args === 'version')
        this.versionExit();
      else
        return this._args;
    }
    catch (err) {
      if (err instanceof ParseError) {
        console.error(err.message);
        process.exit(1);
      }
      else throw err;
    }
  }

  versionExit() {
    console.log(this._config.version());
    process.exit(0);
  }

  _normalizeConfig() {
    const config = this._config;
    const version = get(config, 'version');
    if (type(version) !== 'function')
      set(config, 'version', () => version);
  }
}

module.exports = LiteCli;
