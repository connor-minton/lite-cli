const { pick, set, get, isNumber, funkify } = require('./sak');
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

  showVersion() {
    console.log(this._config.version() || 'no version');
  }

  versionExit() {
    this.showVersion();
    process.exit(0);
  }

  showHelp() {
    console.log(this._config.help());
  }

  helpExit(error, code=0) {
    this.showHelp();
    if (error) {
      if (!isNumber(code) || code === Infinity || code === -Infinity)
        code = 1;
      this.showError(error);
    }
    process.exit(code);
  }

  errorExit(error, code=1) {
    this.showError(error);
    process.exit(code);
  }

  showError(error) {
    let msg = error;
    if (error instanceof Error)
      msg = error.message;
    console.error(`${this._config.name()}: error: ${msg}`);
  }

  _normalizeConfig() {
    const config = this._config;

    for (let cfgKey of ['help', 'name', 'version']) {
      set(config, cfgKey, funkify(get(config, cfgKey)));
    }
  }
}

module.exports = LiteCli;
