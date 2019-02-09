const {
  isObjectLike, touch, get,
  pick, has, isNumber, set,
  type
} = require('./sak');

const { InvalidConfigError } = require('./error');

const optionTypes = ['number', 'boolean', 'string', 'count', 'version'];

class OptionParserConfig {
  constructor(config) {
    this._initConfig(config);
    this._normalizeConfig();
  }

  getNargs(option) {
    return get(this._config, ['options', option, 'nargs']);
  }

  getType(option) {
    return get(this._config, ['options', option, 'type']) || 'boolean';
  }

  getOptions() {
    return this._config.options;
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

  _initConfig(config) {
    this._config = isObjectLike(config) ? config : {};
    touch(this._config, 'options');
    touch(this._config, 'arguments');

    if (has(this._config, 'versionFlags')) {
      let versionFlags = this._config.versionFlags;
      let vFlagsType = type(versionFlags);
      if (vFlagsType === 'string') {
        versionFlags = [versionFlags];
        vFlagsType = 'array';
      }
      if (vFlagsType !== 'array')
        throw new InvalidConfigError(`'versionFlags' must be an array or a string`);

      for (let vFlag of versionFlags) {
        if (!has(this._config.options, vFlag))
          this._config.options[vFlag] = { type: 'version' };
      }
    }
  }

  _normalizeConfig() {
    const opts = this._config.options;
    for (let opt in opts) {
      this._normalizeOptNargs(opt);
      this._normalizeOptType(opt);
    }
  }

  _normalizeOptType(opt) {
    const optConfig = this._config.options[opt];
    const type = get(optConfig, 'type');
    if (type == null)
      set(optConfig, 'type', 'boolean');
    else if (!optionTypes.includes(type))
      throw new InvalidConfigError(`option '${opt}' type '${type}' must be one of ${optionTypes}`);
  }

  _normalizeOptNargs(opt) {
    const optCfg = this._config.options[opt];
    const type = get(optCfg, 'type');
    const nargs = get(optCfg, 'nargs');

    if (['string','number'].includes(type)) {
      if (!isNumber(nargs))
        set(optCfg, 'nargs', 1);
      else if (nargs < 1) {
        throw new InvalidConfigError(`option '${opt}' of type '${type}' must have 1 or more nargs`);
      }
    }

    else if (['boolean', 'count'].includes(type)) {
      if (!isNumber(nargs))
        set(optCfg, 'nargs', 0)
      else if (nargs !== 0)
        throw new InvalidConfigError(`option '${opt}' of type '${type}' cannot have nargs`);
    }
  }
}

module.exports = OptionParserConfig;
