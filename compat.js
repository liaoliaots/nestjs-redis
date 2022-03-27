// https://docs.nestjs.com/first-steps#prerequisites
// https://node.green/

const { targets } = require('core-js-compat')({
    targets: 'node 12.22',
    filter: /^es\./,
    version: '3.21'
});
console.log('targets:', targets);
