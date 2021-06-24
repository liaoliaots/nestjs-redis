import IORedis from 'ioredis';

const client = new IORedis.Cluster(
    [
        {
            host: '127.0.0.1',
            port: 16380
        },
        {
            host: '127.0.0.1',
            port: 16381
        },
        {
            host: '127.0.0.1',
            port: 16382
        }
    ],
    {
        clusterRetryStrategy: () => null,
        redisOptions: {
            password: '15194112589master'
        }
    }
);

client
    .ping()
    .then(res => {
        console.log('res:', res);
    })
    .catch(err => {
        console.log('err:', err);
    });
