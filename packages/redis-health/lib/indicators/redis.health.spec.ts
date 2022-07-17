import { Test, TestingModule } from '@nestjs/testing';
import Redis, { Cluster } from 'ioredis';
import { RedisHealthIndicator } from './redis.health';
import { FAILED_CLUSTER_STATE, CANNOT_BE_READ, ABNORMALLY_MEMORY_USAGE, OPERATIONS_TIMEOUT } from '@health/messages';

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
    indicator = await module.resolve<RedisHealthIndicator>(RedisHealthIndicator);
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

    test('should throw an error if type is invalid', async () => {
      await expect(
        indicator.checkHealth('', { type: 'unknown' as unknown as 'redis', client: redis })
      ).rejects.toThrow();
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

    test('should throw an error if used memory is greater than threshold', async () => {
      jest.spyOn(redis, 'ping').mockResolvedValue('PONG');
      jest.spyOn(redis, 'info').mockResolvedValue('# Memory used_memory:101000 used_memory_human:');

      await expect(
        indicator.checkHealth('redis', { type: 'redis', client: redis, memoryThreshold: 1000 * 100 })
      ).rejects.toThrow(ABNORMALLY_MEMORY_USAGE);
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

      await expect(indicator.checkHealth('', { type: 'cluster', client: cluster })).rejects.toThrow(CANNOT_BE_READ);
    });

    test('should throw an error if cluster info does not contain "cluster_state:ok"', async () => {
      mockClusterInfo.mockResolvedValue('cluster_state:fail');

      await expect(indicator.checkHealth('', { type: 'cluster', client: cluster })).rejects.toThrow(
        FAILED_CLUSTER_STATE
      );
    });
  });
});
