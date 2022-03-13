import { Test, TestingModule } from '@nestjs/testing';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisHealthIndicator } from './redis.health';
import {
    FAILED_CLUSTER_STATE,
    CANNOT_BE_READ,
    MISSING_CLIENT,
    NOT_RESPONSIVE,
    ABNORMALLY_MEMORY_USAGE
} from '@/messages';

describe('RedisHealthIndicator', () => {
    let redisClient: Redis;
    let clusterClient: Cluster;
    let indicator: RedisHealthIndicator;

    beforeEach(async () => {
        redisClient = new IORedis();
        clusterClient = new IORedis.Cluster([]);

        const module: TestingModule = await Test.createTestingModule({ providers: [RedisHealthIndicator] }).compile();
        indicator = module.get<RedisHealthIndicator>(RedisHealthIndicator);
    });

    test('should throw an error if client is not defined', async () => {
        const client = null as unknown as Redis;
        await expect(indicator.checkHealth('', { type: 'redis', client })).rejects.toThrow(MISSING_CLIENT);
    });

    describe('redis', () => {
        test('the status should be up', async () => {
            jest.spyOn(redisClient, 'ping').mockResolvedValue('PONG');
            jest.spyOn(redisClient, 'info').mockResolvedValue('used_memory:100000');

            await expect(
                indicator.checkHealth('redis', {
                    type: 'redis',
                    client: redisClient,
                    timeout: 1000,
                    memoryThreshold: 1024 * 1024 * 100
                })
            ).resolves.toEqual({
                redis: { status: 'up' }
            });
        });

        test('should throw an error if the result of ping is not PONG', async () => {
            jest.spyOn(redisClient, 'ping').mockResolvedValue('');

            await expect(indicator.checkHealth('redis', { type: 'redis', client: redisClient })).rejects.toThrow(
                NOT_RESPONSIVE
            );
        });

        test('the status should be down if error is not an instance of Error', async () => {
            jest.spyOn(redisClient, 'ping').mockRejectedValue(undefined);

            await expect(indicator.checkHealth('redis', { type: 'redis', client: redisClient })).resolves.toEqual({
                redis: { status: 'down' }
            });
        });

        test('should throw an error if ping is rejected', async () => {
            const message = 'a redis error';
            jest.spyOn(redisClient, 'ping').mockRejectedValue(new Error(message));

            await expect(indicator.checkHealth('redis', { type: 'redis', client: redisClient })).rejects.toThrow(
                message
            );
        });

        test('should throw an error if used memory is greater than threshold', async () => {
            jest.spyOn(redisClient, 'ping').mockResolvedValue('PONG');
            jest.spyOn(redisClient, 'info').mockResolvedValue('# Memory used_memory:100001 used_memory_human:873.98K');

            await expect(
                indicator.checkHealth('redis', {
                    type: 'redis',
                    client: redisClient,
                    memoryThreshold: 1000 * 100
                })
            ).rejects.toThrow(ABNORMALLY_MEMORY_USAGE);
        });
    });

    describe('cluster', () => {
        test('the status should be up', async () => {
            jest.spyOn(clusterClient, 'cluster').mockResolvedValue('cluster_state:ok');

            await expect(indicator.checkHealth('cluster', { type: 'cluster', client: clusterClient })).resolves.toEqual(
                {
                    cluster: { status: 'up' }
                }
            );
        });

        test('should throw an error', async () => {
            const message = 'a redis error';
            jest.spyOn(clusterClient, 'cluster').mockRejectedValue(new Error(message));

            await expect(indicator.checkHealth('cluster', { type: 'cluster', client: clusterClient })).rejects.toThrow(
                message
            );
        });

        test('should throw an error if cluster-info is null', async () => {
            jest.spyOn(clusterClient, 'cluster').mockResolvedValue(null);

            await expect(indicator.checkHealth('cluster', { type: 'cluster', client: clusterClient })).rejects.toThrow(
                CANNOT_BE_READ
            );
        });

        test('should throw an error if cluster-info does not contain "cluster_state:ok"', async () => {
            jest.spyOn(clusterClient, 'cluster').mockResolvedValue('cluster_state:fail');

            await expect(indicator.checkHealth('cluster', { type: 'cluster', client: clusterClient })).rejects.toThrow(
                FAILED_CLUSTER_STATE
            );
        });
    });
});
