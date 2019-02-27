const { pick, set, get, isNumber, funkify } = require('./sak');
const OptionParser = require('./option-parser');
const { LiteCliError, ParseError } = require('./error');

const defaultVersionFlags = [ 'v', 'V', 'version' ];
const defaultHelpFlags = [ 'h', '?', 'help' ];

class LiteCli {
  constructor(config) {
    config = config || {};
    this._config = config;
    this._parser = this._createOptionParser();
    this._args = null;
    this._process = config.process || process;
    this._logger = config.logger || console;

    this._normalizeConfig();
  }

  parse(argv) {
    if (!Array.isArray(argv))
      throw new LiteCliError(`'argv' must be an Array`);

    try {
      this._args = this._parser.parse(argv.slice(2));
      if (this._args === 'version')
        this.exitVersion();
      else if (this._args === 'help')
        this.exitHelp();
      else
        return this._args;
    }
    catch (err) {
      if (err instanceof ParseError) {
        this.exitError(err, 1);
      }
      else throw err;
    }
  }

  showVersion() {
    this._logger.log(this._config.version() || 'no version');
  }

  exitVersion() {
    this.showVersion();
    this._process.exit(0);
  }

  showHelp() {
    this._logger.log(this._config.help() || 'no help');
  }

  exitHelp(error, code=0) {
    this.showHelp();
    if (error) {
      if (!isNumber(code) || code === Infinity || code === -Infinity)
        code = 1;
      this.showError(error);
    }
    this._process.exit(code);
  }

  showError(error) {
    let msg = error;
    if (error instanceof Error)
      msg = error.message;
    this._logger.error(`${this._config.name()}: error: ${msg}`);
  }

  exitError(error, code=1) {
    this.showError(error);
    this._process.exit(code);
  }

  showUsage() {
    this._logger.error(this._config.usage() || 'usage: (no usage defined)');
  }

  exitUsage(code=1) {
    this.showUsage();
    this._process.exit(code);
  }

  _normalizeConfig() {
    const config = this._config;

    for (let cfgKey of ['help', 'name', 'version', 'usage']) {
      set(config, cfgKey, funkify(get(config, cfgKey)));
    }
  }

  _createOptionParser() {
    const parserConfig = {
      options: this._config.options,
      arguments: this._config.arguments
    };

    if (this._config.version && !this._config.versionFlags)
      parserConfig.versionFlags = defaultVersionFlags;
    else if (this._config.versionFlags)
      parserConfig.versionFlags = this._config.versionFlags;

    if (this._config.help && !this._config.helpFlags)
      parserConfig.helpFlags = defaultHelpFlags;
    else if (this._config.helpFlags)
      parserConfig.helpFlags = this._config.helpFlags;

    return new OptionParser(parserConfig);
  }
}

module.exports = LiteCli;
