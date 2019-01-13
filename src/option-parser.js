const OptionParserConfig = require('./option-parser-config');
const { ParseError } = require('./error');

class OptionParser {
  constructor(config) {
    this._config = new OptionParserConfig(config);
    this._result = { _: [] };
    this._state = {
      curOpt: null,
      curNargs: null,
      argsParsed: 0,
      done: false,
      args: []
    };
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

    state.args = opts;

    for (let opt of opts) {
      this._parseOpt(opt);
      this._validateState();
      if (state.done) break;
    }

    return result;
  }

  _parseOpt(opt) {
    const result = this._result;
    const state = this._state;
    const config = this._config;

    opt = String(opt);

    if (state.curOpt != null && state.curNargs > 0) {
      result[state.curOpt] = result[state.curOpt] || [];
      result[state.curOpt].push(opt);
      if (--state.curNargs === 0)
        state.curOpt = null;
      state.argsParsed++;
    }
    else if (opt === '--') {
      const rest = state.args.slice(state.argsParsed+1);
      result._.concat(rest);
      state.done = true;
      state.argsParsed += rest.length + 1;
    }
    else if (opt.startsWith('--no-')) {
      const key = opt.substring(5);
      result[key] = false;
      state.argsParsed++;
    }
    else if (opt.startsWith('--')) {
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
    else if (opt[0] === '-') {
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
    else {
      result._.push(opt);
      state.argsParsed++;
    }

    if (state.argsParsed === state.args.length)
      state.done = true;
  }

  _validateState() {
    const state = this._state;
    const config = this._config;

    if (state.curNargs > 0 && state.done) {
      const needsNargs = config.getNargs(state.curOpt);
      const gotNargs = needsNargs - state.curNargs;
      const msg = `Option '${state.curOpt}' requires ${needsNargs} args. Got ${gotNargs}.`;
      throw new ParseError(msg);
    }
  }
}

module.exports = OptionParser;
