const { objectLike, touch, get, pick, has, isNumber } = require('./sak');
const { InvalidConfigError } = require('./error');

const optionTypes = ['number', 'boolean', 'string', 'count'];

class OptionParserConfig {
  constructor(config) {
    this._config = objectLike(config) ? config : {};
    touch(this._config, 'options');
    touch(this._config, 'arguments');

    this._normalizeConfig();
  }

  getNargs(option) {
    return get(this._config, ['options', option, 'nargs']);
  }

  getRequiredOptions() {
    return Object.keys(pick(this._config.options, (opt, cfg) => get(cfg, 'required')));
  }

  isRequired(option) {
    return !!get(this._config.options, [option, 'required']);
  }

  isDefined(option) {
    return has(this._config.options, option);
  }

  get config() {
    return this._config;
  }

  _normalizeConfig() {
    const opts = this._config.options;
    for (let opt in opts) {
      this._normalizeOptNargs(opt);
    }
  }

  _normalizeOptType(opt) {
    const type = get(this._config.options.opt, 'type');
    if (type == null)
      type = 'boolean';
    else if (!optionTypes.includes(type))
      throw new InvalidConfigError(`option '${opt}' type '${type}' must be one of ${optionTypes}`);
  }

  _normalizeOptNargs(opt) {
    const opts = this._config.options;
    if (opts[opt].type === 'string') {
      if (!isNumber(opts[opt].nargs))
        opts[opt].nargs = 1;
      else if (opts[opt].nargs < 1) {
        throw new InvalidConfigError(`option '${opt}' of type 'string' must have 1 or more nargs`);
      }
    }
  }
}

module.exports = OptionParserConfig;
