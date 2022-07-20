import { ModuleRef } from '@nestjs/core';
import { RedisModule } from './redis.module';
import { RedisModuleAsyncOptions } from './interfaces';
import { destroy } from './common';
import { logger } from './redis-logger';
import { REDIS_CLIENTS, REDIS_MERGED_OPTIONS } from './redis.constants';

jest.mock('./common');
jest.mock('./redis-logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

describe('forRoot', () => {
  test('should work correctly', () => {
    const module = RedisModule.forRoot();
    expect(module.global).toBe(true);
    expect(module.module).toBe(RedisModule);
    expect(module.providers?.length).toBeGreaterThanOrEqual(4);
    expect(module.exports?.length).toBeGreaterThanOrEqual(1);
  });
});

describe('forRootAsync', () => {
  test('should work correctly', () => {
    const options: RedisModuleAsyncOptions = {
      imports: [],
      useFactory: () => ({}),
      inject: [],
      extraProviders: [{ provide: '', useValue: '' }]
    };
    const module = RedisModule.forRootAsync(options);
    expect(module.global).toBe(true);
    expect(module.module).toBe(RedisModule);
    expect(module.imports).toBeArray();
    expect(module.providers?.length).toBeGreaterThanOrEqual(5);
    expect(module.exports?.length).toBeGreaterThanOrEqual(1);
  });

  test('without extraProviders', () => {
    const options: RedisModuleAsyncOptions = {
      useFactory: () => ({})
    };
    const module = RedisModule.forRootAsync(options);
    expect(module.providers?.length).toBeGreaterThanOrEqual(4);
  });

  test('should throw an error', () => {
    expect(() => RedisModule.forRootAsync({})).toThrow();
  });
});

describe('onApplicationShutdown', () => {
  const mockDestroy = destroy as jest.MockedFunction<typeof destroy>;
  const mockError = jest.spyOn(logger, 'error');

  beforeEach(() => {
    mockDestroy.mockClear();
    mockError.mockClear();
  });

  test('should work correctly', async () => {
    mockDestroy.mockResolvedValue([
      [
        { status: 'fulfilled', value: '' },
        { status: 'rejected', reason: new Error('') }
      ]
    ]);

    const module = new RedisModule({
      get: (token: unknown) => {
        if (token === REDIS_MERGED_OPTIONS) return { closeClient: true };
        if (token === REDIS_CLIENTS) return new Map();
      }
    } as ModuleRef);
    await module.onApplicationShutdown();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledTimes(1);
  });
});
