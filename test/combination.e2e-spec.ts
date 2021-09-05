import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import IORedis, { Cluster, Redis } from 'ioredis';
import { ClusterModule, RedisModule, InjectCluster, InjectRedis } from '@/.';

jest.mock('ioredis');

describe('combination', () => {
    let clusterClient: Cluster;
    let redisClient: Redis;

    @Injectable()
    class TestCluster {
        constructor(@InjectCluster('default') private readonly clusterClient: Cluster) {}
    }
    @Injectable()
    class TestRedis {
        constructor(@InjectRedis('default') private readonly redisClient: Redis) {}
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ClusterModule.forRoot({
                    closeClient: true,
                    config: {
                        namespace: 'default',
                        nodes: []
                    }
                }),
                RedisModule.forRoot({
                    closeClient: true,
                    config: {
                        namespace: 'default'
                    }
                })
            ],
            providers: [TestCluster, TestRedis]
        }).compile();

        clusterClient = module.get<Cluster>('default');
        redisClient = module.get<Redis>('default');
    });

    afterAll(async () => {
        await clusterClient.quit();
        await redisClient.quit();
    });

    test('should be a redis instance', () => {
        expect(redisClient).toBeInstanceOf(IORedis);
    });

    test('should be a cluster instance', () => {
        expect(clusterClient).toBeInstanceOf(IORedis.Cluster);
    });
});
