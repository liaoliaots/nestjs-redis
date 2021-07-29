/**
 * sentinel config
 *
 * master localhost 6380
 * requirepass 15194112589
 *
 * slave1 localhost 6381
 * requirepass 15194112589
 * slaveof localhost 6380
 * masterauth 15194112589
 *
 * slave2 localhost 6382
 * requirepass 15194112589
 * slaveof localhost 6380
 * masterauth 15194112589
 *
 * sentinel1 localhost 7380
 * requirepass 15194112589sentinel
 * sentinel monitor mymaster localhost 6380 2
 * sentinel auth-pass mymaster 15194112589
 * sentinel down-after-milliseconds mymaster 5000
 *
 * sentinel2 localhost 7381
 * requirepass 15194112589sentinel
 * sentinel monitor mymaster localhost 6380 2
 * sentinel auth-pass mymaster 15194112589
 * sentinel down-after-milliseconds mymaster 5000
 *
 * sudo redis-server /etc/redis/6380.conf
 * sudo redis-server /etc/redis/6381.conf
 * sudo redis-server /etc/redis/6382.conf
 * sudo redis-server /etc/redis/7380.conf --sentinel
 * sudo redis-server /etc/redis/7381.conf --sentinel
 *
 * cluster config
 *
 * cluster 1:
 *
 * master1 localhost 16380
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16380.conf
 * appendonly yes
 *
 * master2 localhost 16381
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16381.conf
 * appendonly yes
 *
 * master3 localhost 16382
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16382.conf
 * appendonly yes
 *
 * sudo redis-server /etc/redis/16380.conf
 * sudo redis-server /etc/redis/16381.conf
 * sudo redis-server /etc/redis/16382.conf
 * redis-cli --cluster create localhost:16380 localhost:16381 localhost:16382 -a 15194112589master
 *
 * cluster 2:
 *
 * master4 localhost 16383
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16383.conf
 * appendonly yes
 *
 * master5 localhost 16384
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16384.conf
 * appendonly yes
 *
 * master6 localhost 16385
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16385.conf
 * appendonly yes
 *
 * sudo redis-server /etc/redis/16383.conf
 * sudo redis-server /etc/redis/16384.conf
 * sudo redis-server /etc/redis/16385.conf
 * redis-cli --cluster create localhost:16383 localhost:16384 localhost:16385 -a 15194112589master
 */

export const testConfig = {
    master: {
        host: 'localhost',
        port: 6380,
        password: '15194112589'
    },
    slave1: {
        host: 'localhost',
        port: 6381,
        password: '15194112589'
    },
    slave2: {
        host: 'localhost',
        port: 6382,
        password: '15194112589'
    },
    sentinel1: {
        host: 'localhost',
        port: 7380,
        password: '15194112589sentinel'
    },
    sentinel2: {
        host: 'localhost',
        port: 7381,
        password: '15194112589sentinel'
    },
    cluster1: {
        host: 'localhost',
        port: 16380,
        password: '15194112589master'
    },
    cluster2: {
        host: 'localhost',
        port: 16381,
        password: '15194112589master'
    },
    cluster3: {
        host: 'localhost',
        port: 16382,
        password: '15194112589master'
    },
    cluster4: {
        host: 'localhost',
        port: 16383,
        password: '15194112589master'
    },
    cluster5: {
        host: 'localhost',
        port: 16384,
        password: '15194112589master'
    },
    cluster6: {
        host: 'localhost',
        port: 16385,
        password: '15194112589master'
    }
};
