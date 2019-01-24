# lite-cli

A zero-ish-dependency library to help you build a CLI.

# Installation

```
npm i @cminton/lite-cli
```

# Example Usage

```js
const LiteCli = require('./lite-cli');
const config = {
  options: {
    v: {
      type: 'count'
    },
    number: {
      type: 'number'
    },
    strings: {
      type: 'string',
      nargs: 2
    }
  }
};

const cli = new LiteCli(config);
const args = cli.parse([
  'node', './script_name.js',
  '-vv',
  '-va',
  '--strings', 'foo', 'bar',
  'positional', 'args'
]);

console.log(JSON.stringify(args, null, 2));
```


#### Output

```json
{
  "_": [
    "positional",
    "args"
  ],
  "v": 3,
  "a": true,
  "strings": [
    "foo",
    "bar"
  ]
}
```


# Configuration

```js
const cliConfig = {
  options: {
    defaultOption: {
      // if an option is passed on the command line but not defined in the cli config,
      // it is treated as a boolean
      type: 'boolean'
    },

    f: {
      // pass as `-f` or `--f`
      type: 'boolean'
    },

    number: {
      // pass as `--number 3`
      type: 'number',
      nargs: 1 // 1 is the default nargs
    },

    strings: {
      // pass as `--strings foo bar`
      type: 'string',
      nargs: 2
    },

    required: {
      // `--required <N>` is required
      type: 'number',
      required: true
    },

    v: {
      // passing `-v` sets `args.v = 1` and `-vv` or `-v ... -v` sets `args.v = 2`
      type: 'count'
    }
  }
};
```
