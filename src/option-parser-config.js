const { getType, initPath } = require('./util');

class OptionParserConfig {
  constructor(config) {
    this._config = getType(config) === 'object' ? config : {};
    initPath(this._config, 'options');
    initPath(this._config, 'arguments');
  }

  getOptionConfig(option) {

  }
}

module.exports = OptionParserConfig;
