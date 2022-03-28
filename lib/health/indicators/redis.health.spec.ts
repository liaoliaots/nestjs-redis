import { Test, TestingModule } from '@nestjs/testing';
import Redis, { Cluster } from 'ioredis';
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

const mockPing = jest.fn();
const mockInfo = jest.fn();
const mockClusterInfo = jest.fn();
jest.mock('ioredis', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        ping: mockPing,
        info: mockInfo
    })),
    Cluster: jest.fn(() => ({
        cluster: mockClusterInfo
    }))
}));

describe('RedisHealthIndicator', () => {
    let redis: Redis;
    let cluster: Cluster;
    let indicator: RedisHealthIndicator;

    beforeEach(async () => {
        mockPing.mockReset();
        mockInfo.mockReset();
        mockClusterInfo.mockReset();
        redis = new Redis();
        cluster = new Cluster([]);

        const module: TestingModule = await Test.createTestingModule({ providers: [RedisHealthIndicator] }).compile();
        indicator = module.get<RedisHealthIndicator>(RedisHealthIndicator);
    });

    test('should throw an error if the argument `client` is not defined', async () => {
        const client = undefined as unknown as Redis;
        await expect(indicator.checkHealth('', { type: 'redis', client })).rejects.toThrow(MISSING_CLIENT);
    });

    test('should throw an error if the argument `type` is not defined', async () => {
        const type = undefined as unknown as 'redis';
        await expect(indicator.checkHealth('', { type, client: redis })).rejects.toThrow(MISSING_TYPE);
    });

    describe('redis', () => {
        test('the status should be up', async () => {
            jest.spyOn(redis, 'ping').mockResolvedValue('PONG');
            jest.spyOn(redis, 'info').mockResolvedValue('# Memory used_memory:100000 used_memory_human:');

            await expect(
                indicator.checkHealth('redis', {
                    type: 'redis',
                    client: redis,
                    timeout: 1000,
                    memoryThreshold: 1024 * 1024 * 100
                })
            ).resolves.toEqual({
                redis: { status: 'up' }
            });
        });

        test('should throw an error if ping is rejected', async () => {
            const message = 'a redis error';
            jest.spyOn(redis, 'ping').mockRejectedValue(new Error(message));

            await expect(indicator.checkHealth('', { type: 'redis', client: redis })).rejects.toThrow(message);
        });

        test('should throw an error if ping timed out', async () => {
            jest.useFakeTimers();

            const waitPromise = (ms: number) =>
                new Promise<string>(resolve => {
                    setTimeout(() => resolve('PONG'), ms);
                });

            jest.spyOn(redis, 'ping').mockImplementation(() => waitPromise(2000));
            const promise = indicator.checkHealth('', { type: 'redis', client: redis });
            jest.runAllTimers();
            await expect(promise).rejects.toThrow(OPERATIONS_TIMEOUT(1000));
        });

        test('should throw an error if the result of ping is not PONG', async () => {
            jest.spyOn(redis, 'ping').mockResolvedValue('');

            await expect(indicator.checkHealth('', { type: 'redis', client: redis })).rejects.toThrow(NOT_RESPONSIVE);
        });

        test('should throw an error if used memory is greater than threshold', async () => {
            jest.spyOn(redis, 'ping').mockResolvedValue('PONG');
            jest.spyOn(redis, 'info').mockResolvedValue('# Memory used_memory:101000 used_memory_human:');

            await expect(
                indicator.checkHealth('redis', { type: 'redis', client: redis, memoryThreshold: 1000 * 100 })
            ).rejects.toThrow(ABNORMALLY_MEMORY_USAGE);
        });

        test('the status should be down if the error is not an instance of Error', async () => {
            jest.spyOn(redis, 'ping').mockRejectedValue(undefined);

            await expect(indicator.checkHealth('redis', { type: 'redis', client: redis })).resolves.toEqual({
                redis: { status: 'down' }
            });
        });
    });

    describe('cluster', () => {
        test('the status should be up', async () => {
            mockClusterInfo.mockResolvedValue('cluster_state:ok');

            await expect(indicator.checkHealth('cluster', { type: 'cluster', client: cluster })).resolves.toEqual({
                cluster: { status: 'up' }
            });
        });

        test('should throw an error', async () => {
            const message = 'a redis error';
            mockClusterInfo.mockRejectedValue(new Error(message));

            await expect(indicator.checkHealth('', { type: 'cluster', client: cluster })).rejects.toThrow(message);
        });

        test('should throw an error if cluster info is null', async () => {
            mockClusterInfo.mockResolvedValue(null);

            await expect(indicator.checkHealth('', { type: 'cluster', client: cluster })).rejects.toThrow(
                CANNOT_BE_READ
            );
        });

        test('should throw an error if cluster info does not contain "cluster_state:ok"', async () => {
            mockClusterInfo.mockResolvedValue('cluster_state:fail');

            await expect(indicator.checkHealth('', { type: 'cluster', client: cluster })).rejects.toThrow(
                FAILED_CLUSTER_STATE
            );
        });
    });
});
