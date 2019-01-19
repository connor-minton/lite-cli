const OptionParserConfig = require('./option-parser-config');
const { ParseError } = require('./error');
const { has } = require('./sak');

class OptionParser {
  constructor(config) {
    this._config = new OptionParserConfig(config);
    this._result = { _: [] };
    this._state = {
      curOpt: null,
      curOptConfig: null,
      curNargs: null,
      argsParsed: 0,
      done: false
    };
    this._originalArgs = [];
  }

  /**
   * Parse is dumb and expects `opts` to be only the script's "logical"
   * arguments, that is, the command line args after the interpreter program
   * and script name.
   */
  parse(opts) {
    const state = this._state;
    const result = this._result;

    if (!Array.isArray(opts)) {
      throw new Error('expected array, got ' + typeof opts);
    }

    this._originalArgs = opts;

    for (let opt of opts) {
      this._parseOpt(opt);
      this._validateState();
      if (state.done) break;
    }

    return result;
  }

  _parseOpt(opt) {
    const state = this._state;

    opt = String(opt);

    if (opt === '--') {
      this._parseRest();
    }
    else if (state.curOpt != null && state.curNargs > 0) {
      this._parseArgOfCurOpt(opt);
    }
    else if (opt.startsWith('--no-')) {
      this._parseNegateOpt(opt);
    }
    else if (opt.startsWith('--')) {
      this._parseDoubleDashOpt(opt);
    }
    else if (opt[0] === '-') {
      this._parseSingleDashOpt(opt);
    }
    else {
      this._parsePositionalArg(opt);
    }

    if (state.argsParsed === this._originalArgs.length)
      state.done = true;
  }

  _parsePositionalArg(opt) {
    this._result._.push(opt);
    this._state.argsParsed++;
  }

  _parseSingleDashOpt(opt) {
    const state = this._state;
    const result = this._result;
    const config = this._config;

    const key = opt.substring(1);
    const nargs = config.getNargs(key);
    if (nargs > 0) {
      state.curNargs = nargs;
      state.curOpt = key;
    }
    else {
      result[key] = true;
    }
    state.argsParsed++;
  }

  _parseDoubleDashOpt(opt) {
    const state = this._state;
    const result = this._result;
    const config = this._config;

    const key = opt.substring(2);
    const nargs = config.getNargs(key);
    if (nargs > 0) {
      state.curNargs = nargs;
      state.curOpt = key;
    }
    else {
      result[key] = true;
    }
    state.argsParsed++;
  }

  _parseNegateOpt(opt) {
    const key = opt.substring(5);
    this._result[key] = false;
    this._state.argsParsed++;
  }

  _parseRest() {
    const state = this._state;
    const result = this._result;

    const rest = this._originalArgs.slice(state.argsParsed+1);
    result._.concat(rest);
    state.done = true;
    state.argsParsed += rest.length + 1;
  }

  _parseArgOfCurOpt(opt) {
    const result = this._result;
    const state = this._state;

    result[state.curOpt] = result[state.curOpt] || [];
    result[state.curOpt].push(opt);
    if (--state.curNargs === 0)
      state.curOpt = null;
    state.argsParsed++;
  }

  _validateState() {
    const state = this._state;
    const config = this._config;
    const result = this._result;

    if (state.done) {
      if (state.curNargs > 0) {
        const needsNargs = config.getNargs(state.curOpt);
        const gotNargs = needsNargs - state.curNargs;
        const msg = `Option '${state.curOpt}' requires ${needsNargs} args. Got ${gotNargs}.`;
        throw new ParseError(msg);
      }

      for (let opt of config.getRequiredOptions()) {
        if (!has(result, opt)) {
          const msg = `Missing required option '${opt}'.`;
          throw new ParseError(msg);
        }
      }
    }
  }
}

module.exports = OptionParser;
