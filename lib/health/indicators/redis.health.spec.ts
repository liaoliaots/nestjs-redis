import { Test, TestingModule } from '@nestjs/testing';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisHealthIndicator } from './redis.health';
import {
    FAILED_CLUSTER_STATE,
    CANNOT_BE_READ,
    MISSING_CLIENT,
    NOT_RESPONSIVE,
    ABNORMALLY_MEMORY_USAGE,
    MISSING_TYPE,
    OPERATIONS_TIMEOUT
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

    test('should throw an error if the Argument `client` is not defined', async () => {
        const client = undefined as unknown as Redis;
        await expect(indicator.checkHealth('', { type: 'redis', client })).rejects.toThrow(MISSING_CLIENT);
    });

    test('should throw an error if the Argument `type` is not defined', async () => {
        const type = undefined as unknown as 'redis';
        await expect(indicator.checkHealth('', { type, client: redisClient })).rejects.toThrow(MISSING_TYPE);
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

        test('should throw an error if ping is rejected', async () => {
            const message = 'a redis error';
            jest.spyOn(redisClient, 'ping').mockRejectedValue(new Error(message));

            await expect(indicator.checkHealth('', { type: 'redis', client: redisClient })).rejects.toThrow(message);
        });

        test('should throw an error if ping timed out', async () => {
            jest.useFakeTimers();

            const waitPromise = (ms: number) =>
                new Promise<string>(resolve => {
                    setTimeout(() => resolve('PONG'), ms);
                });

            jest.spyOn(redisClient, 'ping').mockImplementation(() => waitPromise(2000));
            const promise = indicator.checkHealth('', { type: 'redis', client: redisClient });
            jest.runAllTimers();
            await expect(promise).rejects.toThrow(OPERATIONS_TIMEOUT(1000));
        });

        test('should throw an error if the result of ping is not PONG', async () => {
            jest.spyOn(redisClient, 'ping').mockResolvedValue('');

            await expect(indicator.checkHealth('', { type: 'redis', client: redisClient })).rejects.toThrow(
                NOT_RESPONSIVE
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

        test('the status should be down if the error is not an instance of Error', async () => {
            jest.spyOn(redisClient, 'ping').mockRejectedValue(undefined);

            await expect(indicator.checkHealth('redis', { type: 'redis', client: redisClient })).resolves.toEqual({
                redis: { status: 'down' }
            });
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

            await expect(indicator.checkHealth('', { type: 'cluster', client: clusterClient })).rejects.toThrow(
                message
            );
        });

        test('should throw an error if cluster-info is null', async () => {
            jest.spyOn(clusterClient, 'cluster').mockResolvedValue(null);

            await expect(indicator.checkHealth('', { type: 'cluster', client: clusterClient })).rejects.toThrow(
                CANNOT_BE_READ
            );
        });

        test('should throw an error if cluster-info does not contain "cluster_state:ok"', async () => {
            jest.spyOn(clusterClient, 'cluster').mockResolvedValue('cluster_state:fail');

            await expect(indicator.checkHealth('', { type: 'cluster', client: clusterClient })).rejects.toThrow(
                FAILED_CLUSTER_STATE
            );
        });
    });
});
