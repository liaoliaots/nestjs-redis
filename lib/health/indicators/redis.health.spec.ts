import { Test, TestingModule } from '@nestjs/testing';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisHealthIndicator } from './redis.health';
import { FAILED_CLUSTER_STATE, CANNOT_BE_READ } from '@/messages';

describe('RedisHealthIndicator', () => {
    let redisClient: Redis;
    let clusterClient: Cluster;
    let indicator: RedisHealthIndicator;

    beforeEach(async () => {
        redisClient = new IORedis();
        clusterClient = new IORedis.Cluster([{ host: '127.0.0.1', port: 16380 }]);

        const module: TestingModule = await Test.createTestingModule({ providers: [RedisHealthIndicator] }).compile();

        indicator = module.get<RedisHealthIndicator>(RedisHealthIndicator);
    });

    test('should throw an error if the client is null', async () => {
        const client = null as unknown as Redis;
        await expect(indicator.checkHealth('', { client })).rejects.toThrow();
    });

    describe('redis', () => {
        test('the status should be up', async () => {
            jest.spyOn(redisClient, 'ping').mockResolvedValue('PONG');

            await expect(indicator.checkHealth('redis', { client: redisClient })).resolves.toEqual({
                redis: { status: 'up' }
            });
        });

        test('the status should be down', async () => {
            jest.spyOn(redisClient, 'ping').mockRejectedValue(undefined);

            await expect(indicator.checkHealth('redis', { client: redisClient })).resolves.toEqual({
                redis: { status: 'down' }
            });
        });

        test('should throw an error', async () => {
            const message = 'a redis error';
            jest.spyOn(redisClient, 'ping').mockRejectedValue(new Error(message));

            await expect(indicator.checkHealth('redis', { client: redisClient })).rejects.toThrow(message);
        });
    });

    describe('cluster', () => {
        test('the status should be up', async () => {
            jest.spyOn(clusterClient, 'cluster').mockResolvedValue('cluster_state:ok');

            await expect(indicator.checkHealth('cluster', { client: clusterClient })).resolves.toEqual({
                cluster: { status: 'up' }
            });
        });

        test('should throw an error', async () => {
            const message = 'a redis error';
            jest.spyOn(clusterClient, 'cluster').mockRejectedValue(new Error(message));

            await expect(indicator.checkHealth('cluster', { client: clusterClient })).rejects.toThrow(message);
        });

        test('should throw an error if cluster-info is null', async () => {
            jest.spyOn(clusterClient, 'cluster').mockResolvedValue(null);

            await expect(indicator.checkHealth('cluster', { client: clusterClient })).rejects.toThrow(CANNOT_BE_READ);
        });

        test('should throw an error if cluster-info does not contain "cluster_state:ok"', async () => {
            jest.spyOn(clusterClient, 'cluster').mockResolvedValue('cluster_state:fail');

            await expect(indicator.checkHealth('cluster', { client: clusterClient })).rejects.toThrow(
                FAILED_CLUSTER_STATE
            );
        });
    });
});
