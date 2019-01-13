const OptionParserConfig = require('../src/option-parser-config');

const cfg = {
  options: {
    hi: {
      required: true
    },
    bye: {
      required: false
    },
    more: {
      required: true
    }
  }
};

let optConfig = new OptionParserConfig(cfg);

console.log(JSON.stringify(optConfig.getRequiredOptions(), null, 2));
console.log(optConfig.isRequired('hi'));
console.log(optConfig.isRequired('bye'));
console.log(optConfig.isRequired('more'));
console.log('---');
console.log(optConfig.isDefined('hi'));
console.log(optConfig.isDefined('notdefined'));
console.log(optConfig.isDefined('bye'));
