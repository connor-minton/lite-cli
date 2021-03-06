const {
  isObjectLike, touch, get,
  pick, has, isNumber, set,
  type
} = require('./sak');

const { InvalidConfigError } = require('./error');

const optionTypes = ['number', 'boolean', 'string', 'count', 'version', 'help'];

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

    this._initSpecialFlags(['version', 'help']);
  }

  _initSpecialFlags(specialFlags) {
    for (let specialFlag of specialFlags) {
      const flagsConfigKey = specialFlag + 'Flags';
      if (has(this._config, flagsConfigKey)) {
        let flags = this._config[flagsConfigKey];
        let flagsType = type(flags);
        if (flagsType === 'string') {
          flags = [flags];
          flagsType = 'array';
        }
        if (flagsType !== 'array')
          throw new InvalidConfigError(`'${flagsConfigKey}' must be an array or a string`);

        for (let flag of flags) {
          if (!has(this._config.options, flag))
            this._config.options[flag] = { type: specialFlag };
        }
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

    if (!type && nargs) {
      set(optCfg, 'type', 'string');
    }

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
