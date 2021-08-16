import { Test, TestingModule } from '@nestjs/testing';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisHealthIndicator } from './redis.health';
import { testConfig } from '../../../test/env';

describe('RedisHealthIndicator', () => {
    let redisClient: Redis;
    let clusterClient: Cluster;
    let indicator: RedisHealthIndicator;

    beforeAll(async () => {
        redisClient = new IORedis(testConfig.master);
        clusterClient = new IORedis.Cluster([{ host: testConfig.cluster1.host, port: testConfig.cluster1.port }], {
            redisOptions: { password: testConfig.cluster1.password }
        });

        const module: TestingModule = await Test.createTestingModule({ providers: [RedisHealthIndicator] }).compile();

        indicator = await module.resolve<RedisHealthIndicator>(RedisHealthIndicator);
    });

    afterAll(() => {
        redisClient.disconnect();
        clusterClient.disconnect();
    });

    test('the status should be up', async () => {
        await expect(indicator.checkHealth('redis', { client: redisClient })).resolves.toEqual({
            redis: { status: 'up' }
        });
        await expect(indicator.checkHealth('cluster', { client: clusterClient })).resolves.toEqual({
            cluster: { status: 'up' }
        });
    });

    test('should throw an error', async () => {
        const client = null as unknown as Redis;
        await expect(indicator.checkHealth('redis', { client })).rejects.toThrow();
    });
});
