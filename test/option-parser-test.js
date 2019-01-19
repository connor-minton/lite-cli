const Parser = require('../src/option-parser');
let config;
if (process.env.CONFIG)
  config = require('./' + process.env.CONFIG);

console.log(JSON.stringify(new Parser(config).parse(process.argv.slice(2)), null, 2));
