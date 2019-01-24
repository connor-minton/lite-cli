const LiteCli = require('../src/lite-cli');

let config;
if (process.env.CONFIG)
  config = require('./configs/' + process.env.CONFIG);

const cli = new LiteCli(config);
const args = cli.parse(process.argv);

console.log(JSON.stringify(args, null, 2));
