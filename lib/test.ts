import IORedis from 'ioredis';
import { Logger } from '@nestjs/common';
import { removeLineBreaks, parseUsedMemory } from './utils';

const logger = new Logger('test.ts');

const c1 = new IORedis({
    host: '127.0.0.1',
    port: 6380,
    password: 'redismain'
});
c1.on('error', (err: Error) => {
    logger.error(err.message, err.stack);
});

c1.info('memory')
    .then(res => {
        console.log(res);
        console.log('--> memory:', removeLineBreaks(res));
        console.log('--> memory:', parseUsedMemory(removeLineBreaks(res)));
    })
    .catch(err => {
        console.log('--> memory err:', err);
    });

// setInterval(() => {
//     c1.ping()
//         .then(res => {
//             console.log('--> setInterval res:', res);
//         })
//         .catch(err => {
//             console.log('--> setInterval err:', err);
//         });
// }, 1000);
