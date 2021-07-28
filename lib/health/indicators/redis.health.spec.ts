import { Test } from '@nestjs/testing';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisHealthIndicator } from './redis.health';
import { RedisHealthModule } from '../redis-health.module';
import { testConfig } from '../../../test/env';

describe(`${RedisHealthIndicator.name}`, () => {
    let redisClient: Redis;
    let clusterClient: Cluster;

    let redisHealth: RedisHealthIndicator;

    afterAll(() => {
        redisClient.disconnect();
        clusterClient.disconnect();
    });

    beforeAll(async () => {
        redisClient = new IORedis({ ...testConfig.master });
        clusterClient = new IORedis.Cluster([{ host: testConfig.cluster1.host, port: testConfig.cluster1.port }], {
            redisOptions: { password: testConfig.cluster1.password }
        });

        const moduleRef = await Test.createTestingModule({
            imports: [RedisHealthModule],
            providers: [RedisHealthIndicator]
        }).compile();

        redisHealth = await moduleRef.resolve<RedisHealthIndicator>(RedisHealthIndicator);
    });

    test('should state up', async () => {
        await expect(redisHealth.check('redis', { client: redisClient })).resolves.toEqual({
            redis: { status: 'up' }
        });

        await expect(redisHealth.check('cluster', { client: clusterClient })).resolves.toEqual({
            cluster: { status: 'up' }
        });
    });
});
