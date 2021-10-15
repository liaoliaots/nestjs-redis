import { Injectable, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import IORedis, { Cluster, Redis } from 'ioredis';
import { ClusterModule, RedisModule, InjectCluster, InjectRedis } from '@/.';

jest.mock('ioredis');

describe('global', () => {
    let clusterClient: Cluster;
    let redisClient: Redis;

    @Injectable()
    class TestCluster {
        constructor(@InjectCluster('default') cluster: Cluster) {
            clusterClient = cluster;
        }
    }
    @Injectable()
    class TestRedis {
        constructor(@InjectRedis('default') redis: Redis) {
            redisClient = redis;
        }
    }
    @Module({
        providers: [TestCluster, TestRedis]
    })
    class MyModule {}

    beforeAll(async () => {
        await Test.createTestingModule({
            imports: [
                ClusterModule.forRoot({
                    config: {
                        namespace: 'default',
                        nodes: []
                    }
                }),
                RedisModule.forRoot({
                    config: {
                        namespace: 'default'
                    }
                }),
                MyModule
            ]
        }).compile();
    });

    test('should be a cluster instance', () => {
        expect(clusterClient).toBeInstanceOf(IORedis.Cluster);
    });

    test('should be a redis instance', () => {
        expect(redisClient).toBeInstanceOf(IORedis);
    });
});
