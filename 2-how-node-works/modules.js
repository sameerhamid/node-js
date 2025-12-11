// console.log((arguments))
// console.log(require('module').wrapper)


// module.exports
const Cal = require('./test-module-1')

const cal1 = new Cal();

console.log(cal1.add(2, 5));

// exports
const cal2 = require('./test-module-2');
console.log(cal2.add(2, 5));
const {add, multiply, divide} = require('./test-module-2');
console.log(add(2, 5))

// caching

require('./test-module-3')()
require('./test-module-3')()
require('./test-module-3')()
