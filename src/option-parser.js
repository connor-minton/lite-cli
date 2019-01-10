class OptionParser {
  constructor(config) {
    this._config = config || {};
  }

  /**
   * Parse is dumb and expects `opts` to be only the script's "actual"
   * arguments, that is, the command line args after the interpreter program
   * and script name.
   */
  parse(opts) {
    if (!Array.isArray(opts)) {
      throw new Error('expected array, got ' + typeof opts);
    }

    const results = {
      _: []
    };

    // ignore config for now. let's implement the zero-config parser

    for (let i = 0; i < opts.length; i++) {
      const opt = String(opts[i]);
      if (opt === '--') {
        results._.concat(opts.slice(i+1));
        break;
      }
      else if (opt.startsWith('--no-')) {
        const key = opt.substring(5);
        results[key] = false;
      }
      else if (opt.startsWith('--')) {
        const key = opt.substring(2);
        results[key] = true;
      }
      else if (opt[0] === '-') {
        const key = opt.substring(1);
        results[key] = true;
      }
      else {
        results._.push(opt);
      }
    }

    return results;
  }
}

module.exports = OptionParser;
