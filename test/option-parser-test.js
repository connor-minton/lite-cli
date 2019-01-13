const Parser = require('../src/option-parser');
const config = require('./configs/config1.js');

console.log(JSON.stringify(new Parser(config).parse(process.argv.slice(2)), null, 2));
