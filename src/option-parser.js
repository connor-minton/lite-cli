const OptionParserConfig = require('./option-parser-config');
const { ParseError } = require('./error');
const { has, isNumber } = require('./sak');

class OptionParser {
  constructor(config) {
    this._config = new OptionParserConfig(config);
    this._result = { _: [] };
    this._originalArgs = [];

    this._initState();
    this._initResults();
  }

  /**
   * Parse is dumb and expects `opts` to be only the script's "logical"
   * arguments, that is, the command line args after the interpreter program
   * and script name.
   */
  parse(opts) {
    if (!Array.isArray(opts)) {
      throw new Error('expected array, got ' + typeof opts);
    }

    this._originalArgs = opts;

    return this._parseOpts(opts);
  }

  _initResults() {
    this._result = { _: [] };
    for (let opt of Object.keys(this._config.getOptions())) {
      if (this._config.getType(opt) === 'count')
        this._result[opt] = 0;
    }
  }

  _initState() {
    this._state = {
      curOpt: null,
      curOptType: null,
      curNargs: null,
      argsParsed: 0,
      done: false
    };
  }

  _parseOpts(opts) {
    if (opts.length === 0) {
      this._state.done = true;
    }

    for (let opt of opts) {
      this._parseOpt(opt);
      if (this._state.done) break;
    }

    this._validateState();
    return this._result;
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
    const type = config.getType(key);

    if (nargs > 0) {
      state.curNargs = nargs;
      state.curOpt = key;
      state.curOptType = type;
    }
    else if (type === 'boolean') {
      result[key] = true;
    }
    else if (type === 'count') {
      result[key]++;
    }
    state.argsParsed++;
  }

  _parseDoubleDashOpt(opt) {
    const state = this._state;
    const result = this._result;
    const config = this._config;

    const key = opt.substring(2);
    const type = config.getType(key);
    const nargs = config.getNargs(key);

    if (nargs > 0) {
      state.curNargs = nargs;
      state.curOpt = key;
      state.curOptType = type;
    }
    else if (type === 'boolean') {
      result[key] = true;
    }
    else if (type === 'count') {
      result[key]++;
    }
    state.argsParsed++;
  }

  _parseNegateOpt(opt) {
    const key = opt.substring(5);
    const type = this._config.getType(key);
    if (type !== 'boolean')
      throw new ParseError(`bad flag ${opt}: option ${key} is not boolean`);
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
    const curOpt = state.curOpt;
    const curType = state.curOptType;
    const nargs = this._config.getNargs(curOpt);

    if (nargs !== 1)
      result[curOpt] = result[curOpt] || [];

    if (curType === 'string') {
      if (nargs === 1)
        result[curOpt] = opt;
      else
        result[curOpt].push(opt);
    }

    else if (curType === 'number') {
      if (!isNumber(Number(opt)))
        throw new ParseError(`option ${curOpt} expects a number: got '${opt}'`);
      if (nargs === 1)
        result[curOpt] = Number(opt);
      else
        result[curOpt].push(Number(opt));
    }

    if (--state.curNargs === 0) {
      state.curOpt = null;
      state.curOptType = null;
    }
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
        if (!has(result, opt) || config.getType(opt) === 'count' && result[opt] === 0) {
          const msg = `Missing required option '${opt}'.`;
          throw new ParseError(msg);
        }
      }
    }
  }
}

module.exports = OptionParser;
