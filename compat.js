// https://docs.nestjs.com/first-steps#prerequisites
// https://node.green/

const { targets } = require('core-js-compat')({
    targets: 'node 10.13',
    filter: /^es\./,
    version: '3.21'
});
console.log('targets:', targets);
