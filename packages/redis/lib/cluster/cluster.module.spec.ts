import { ClusterModule } from './cluster.module';
import { ClusterModuleAsyncOptions } from './interfaces';
import { destroy } from './common';
import { logger } from './cluster-logger';

jest.mock('./common');
jest.mock('./cluster-logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

describe('forRoot', () => {
  test('should work correctly', () => {
    const module = ClusterModule.forRoot({ config: { nodes: [] } });
    expect(module.global).toBe(true);
    expect(module.module).toBe(ClusterModule);
    expect(module.providers?.length).toBeGreaterThanOrEqual(4);
    expect(module.exports?.length).toBeGreaterThanOrEqual(1);
  });
});

describe('forRootAsync', () => {
  test('should work correctly', () => {
    const options: ClusterModuleAsyncOptions = {
      imports: [],
      useFactory: () => ({ config: { nodes: [] } }),
      inject: [],
      extraProviders: [{ provide: '', useValue: '' }]
    };
    const module = ClusterModule.forRootAsync(options);
    expect(module.global).toBe(true);
    expect(module.module).toBe(ClusterModule);
    expect(module.imports).toBeArray();
    expect(module.providers?.length).toBeGreaterThanOrEqual(5);
    expect(module.exports?.length).toBeGreaterThanOrEqual(1);
  });

  test('without extraProviders', () => {
    const options: ClusterModuleAsyncOptions = {
      imports: [],
      useFactory: () => ({ config: { nodes: [] } }),
      inject: []
    };
    const module = ClusterModule.forRootAsync(options);
    expect(module.global).toBe(true);
    expect(module.module).toBe(ClusterModule);
    expect(module.imports).toBeArray();
    expect(module.providers?.length).toBeGreaterThanOrEqual(4);
    expect(module.exports?.length).toBeGreaterThanOrEqual(1);
  });

  test('should throw an error', () => {
    expect(() => ClusterModule.forRootAsync({})).toThrow();
  });
});

describe('onApplicationShutdown', () => {
  const mockDestroy = destroy as jest.MockedFunction<typeof destroy>;
  const mockError = jest.spyOn(logger, 'error');

  beforeEach(() => {
    mockDestroy.mockClear();
    mockError.mockClear();
  });

  test('should be invoked', async () => {
    mockDestroy.mockResolvedValue([
      [
        { status: 'fulfilled', value: '' },
        { status: 'rejected', reason: new Error('') }
      ]
    ]);

    const module = new ClusterModule({ closeClient: true, config: { nodes: [] } }, new Map());
    await module.onApplicationShutdown();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledTimes(1);
  });
});
