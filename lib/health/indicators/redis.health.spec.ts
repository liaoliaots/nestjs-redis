import { Test } from '@nestjs/testing';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisHealthIndicator } from './redis.health';
import { testConfig } from '../../../test/env';

describe(`${RedisHealthIndicator.name}`, () => {
    let redisClient: Redis;
    let clusterClient: Cluster;

    let redisHealthIndicator: RedisHealthIndicator;

    afterAll(() => {
        redisClient.disconnect();
        clusterClient.disconnect();
    });

    beforeAll(async () => {
        redisClient = new IORedis(testConfig.master);
        clusterClient = new IORedis.Cluster([testConfig.cluster1], {
            redisOptions: { password: testConfig.cluster1.password }
        });

        const moduleRef = await Test.createTestingModule({ providers: [RedisHealthIndicator] }).compile();

        redisHealthIndicator = await moduleRef.resolve<RedisHealthIndicator>(RedisHealthIndicator);
    });

    test('the state should be up', async () => {
        await expect(redisHealthIndicator.checkHealth('redis', { client: redisClient })).resolves.toEqual({
            redis: { status: 'up' }
        });
        await expect(redisHealthIndicator.checkHealth('cluster', { client: clusterClient })).resolves.toEqual({
            cluster: { status: 'up' }
        });
    });

    test('should throw an error', async () => {
        const client = null as unknown as Redis;

        await expect(redisHealthIndicator.checkHealth('redis', { client })).rejects.toThrow();
    });
});
