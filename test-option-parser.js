const Parser = require('./src/option-parser');
console.log(JSON.stringify(new Parser().parse(process.argv.slice(2)), null, 2));
