/**
 * sentinel config
 *
 * master 127.0.0.1 6380
 * requirepass 15194112589
 *
 * slave1 127.0.0.1 6381
 * requirepass 15194112589
 * slaveof 127.0.0.1 6380
 * masterauth 15194112589
 *
 * slave2 127.0.0.1 6382
 * requirepass 15194112589
 * slaveof 127.0.0.1 6380
 * masterauth 15194112589
 *
 * sentinel1 127.0.0.1 7380
 * requirepass 15194112589sentinel
 * sentinel monitor mymaster 127.0.0.1 6380 2
 * sentinel auth-pass mymaster 15194112589
 * sentinel down-after-milliseconds mymaster 5000
 *
 * sentinel2 127.0.0.1 7381
 * requirepass 15194112589sentinel
 * sentinel monitor mymaster 127.0.0.1 6380 2
 * sentinel auth-pass mymaster 15194112589
 * sentinel down-after-milliseconds mymaster 5000
 *
 * sudo redis-server /etc/redis/6380.conf
 * sudo redis-server /etc/redis/6381.conf
 * sudo redis-server /etc/redis/6382.conf
 * sudo redis-server /etc/redis/7380.conf --sentinel
 * sudo redis-server /etc/redis/7381.conf --sentinel
 *
 * -- Heart is higher than the sky, life is thinner than paper --
 *
 * cluster config
 *
 * master1 127.0.0.1 16380
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16380.conf
 * appendonly yes
 *
 * master2 127.0.0.1 16381
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16381.conf
 * appendonly yes
 *
 * master3 127.0.0.1 16382
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16382.conf
 * appendonly yes
 *
 * sudo redis-server /etc/redis/16380.conf
 * sudo redis-server /etc/redis/16381.conf
 * sudo redis-server /etc/redis/16382.conf
 * redis-cli --cluster create 127.0.0.1:16380 127.0.0.1:16381 127.0.0.1:16382 -a 15194112589master
 *
 * master4 127.0.0.1 16383
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16383.conf
 * appendonly yes
 *
 * master5 127.0.0.1 16384
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16384.conf
 * appendonly yes
 *
 * master6 127.0.0.1 16385
 * requirepass 15194112589master
 * cluster-enabled yes
 * cluster-config-file nodes-16385.conf
 * appendonly yes
 *
 * sudo redis-server /etc/redis/16383.conf
 * sudo redis-server /etc/redis/16384.conf
 * sudo redis-server /etc/redis/16385.conf
 * redis-cli --cluster create 127.0.0.1:16383 127.0.0.1:16384 127.0.0.1:16385 -a 15194112589master
 */

process.env.MASTER_HOST = '127.0.0.1';
process.env.MASTER_PORT = '6380';
process.env.MASTER_PASSWORD = '15194112589';
process.env.SLAVE_1_HOST = '127.0.0.1';
process.env.SLAVE_1_PORT = '6381';
process.env.SLAVE_1_PASSWORD = '15194112589';
process.env.SLAVE_2_HOST = '127.0.0.1';
process.env.SLAVE_2_PORT = '6382';
process.env.SLAVE_2_PASSWORD = '15194112589';
process.env.SENTINEL_1_HOST = '127.0.0.1';
process.env.SENTINEL_1_PORT = '7380';
process.env.SENTINEL_1_PASSWORD = '15194112589sentinel';
process.env.SENTINEL_2_HOST = '127.0.0.1';
process.env.SENTINEL_2_PORT = '7381';
process.env.SENTINEL_2_PASSWORD = '15194112589sentinel';

process.env.CLUSTER_1_HOST = '127.0.0.1';
process.env.CLUSTER_1_PORT = '16380';
process.env.CLUSTER_1_PASSWORD = '15194112589master';
process.env.CLUSTER_2_HOST = '127.0.0.1';
process.env.CLUSTER_2_PORT = '16381';
process.env.CLUSTER_2_PASSWORD = '15194112589master';
process.env.CLUSTER_3_HOST = '127.0.0.1';
process.env.CLUSTER_3_PORT = '16382';
process.env.CLUSTER_3_PASSWORD = '15194112589master';

process.env.CLUSTER_4_HOST = '127.0.0.1';
process.env.CLUSTER_4_PORT = '16383';
process.env.CLUSTER_4_PASSWORD = '15194112589master';
process.env.CLUSTER_5_HOST = '127.0.0.1';
process.env.CLUSTER_5_PORT = '16384';
process.env.CLUSTER_5_PASSWORD = '15194112589master';
process.env.CLUSTER_6_HOST = '127.0.0.1';
process.env.CLUSTER_6_PORT = '16385';
process.env.CLUSTER_6_PASSWORD = '15194112589master';

export const testConfig = {
    master: {
        host: process.env.MASTER_HOST,
        port: Number.parseInt(process.env.MASTER_PORT, 10),
        password: process.env.MASTER_PASSWORD
    },
    slave1: {
        host: process.env.SLAVE_1_HOST,
        port: Number.parseInt(process.env.SLAVE_1_PORT, 10),
        password: process.env.SLAVE_1_PASSWORD
    },
    slave2: {
        host: process.env.SLAVE_2_HOST,
        port: Number.parseInt(process.env.SLAVE_2_PORT, 10),
        password: process.env.SLAVE_2_PASSWORD
    },
    sentinel1: {
        host: process.env.SENTINEL_1_HOST,
        port: Number.parseInt(process.env.SENTINEL_1_PORT, 10),
        password: process.env.SENTINEL_1_PASSWORD
    },
    sentinel2: {
        host: process.env.SENTINEL_2_HOST,
        port: Number.parseInt(process.env.SENTINEL_2_PORT, 10),
        password: process.env.SENTINEL_2_PASSWORD
    },
    cluster1: {
        host: process.env.CLUSTER_1_HOST,
        port: Number.parseInt(process.env.CLUSTER_1_PORT, 10),
        password: process.env.CLUSTER_1_PASSWORD
    },
    cluster2: {
        host: process.env.CLUSTER_2_HOST,
        port: Number.parseInt(process.env.CLUSTER_2_PORT, 10),
        password: process.env.CLUSTER_2_PASSWORD
    },
    cluster3: {
        host: process.env.CLUSTER_3_HOST,
        port: Number.parseInt(process.env.CLUSTER_3_PORT, 10),
        password: process.env.CLUSTER_3_PASSWORD
    },
    cluster4: {
        host: process.env.CLUSTER_4_HOST,
        port: Number.parseInt(process.env.CLUSTER_4_PORT, 10),
        password: process.env.CLUSTER_4_PASSWORD
    },
    cluster5: {
        host: process.env.CLUSTER_5_HOST,
        port: Number.parseInt(process.env.CLUSTER_5_PORT, 10),
        password: process.env.CLUSTER_5_PASSWORD
    },
    cluster6: {
        host: process.env.CLUSTER_6_HOST,
        port: Number.parseInt(process.env.CLUSTER_6_PORT, 10),
        password: process.env.CLUSTER_6_PASSWORD
    }
};
