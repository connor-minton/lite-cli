const { objectLike, touch, get, pick, has } = require('./sak');

class OptionParserConfig {
  constructor(config) {
    this._config = objectLike(config) ? config : {};
    touch(this._config, 'options');
    touch(this._config, 'arguments');
  }

  getNargs(option) {
    return get(this._config, ['options', option, 'nargs']);
  }

  getRequiredOptions() {
    return pick(this._config.options, (opt, cfg) => get(cfg, 'required'));
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
}

module.exports = OptionParserConfig;
