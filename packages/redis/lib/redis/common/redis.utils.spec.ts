import Redis from 'ioredis';
import { createClient, destroy, addListeners } from './redis.utils';
import { RedisClients, RedisClientOptions } from '../interfaces';
import { NAMESPACE_KEY } from '../redis.constants';

jest.mock('../redis-logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}));

const mockOn = jest.fn();
jest.mock('ioredis', () =>
  jest.fn(() => ({
    on: mockOn,
    quit: jest.fn(),
    disconnect: jest.fn()
  }))
);

const MockedRedis = Redis as jest.MockedClass<typeof Redis>;
beforeEach(() => {
  MockedRedis.mockClear();
  mockOn.mockReset();
});

describe('createClient', () => {
  describe('with URL', () => {
    const url = 'redis://:authpassword@127.0.0.1:6380/4';

    test('should create a client with a URL', () => {
      const client = createClient({ url }, {});
      expect(client).toBeDefined();
      expect(MockedRedis).toHaveBeenCalledTimes(1);
      expect(MockedRedis).toHaveBeenCalledWith(url, {});
      expect(MockedRedis.mock.instances).toHaveLength(1);
    });

    test('should create a client with a URL and options', () => {
      const client = createClient({ url, lazyConnect: true }, {});
      expect(client).toBeDefined();
      expect(MockedRedis).toHaveBeenCalledTimes(1);
      expect(MockedRedis).toHaveBeenCalledWith(url, { lazyConnect: true });
      expect(MockedRedis.mock.instances).toHaveLength(1);
    });
  });

  describe('with path', () => {
    test('should create a client with a path', () => {
      const path = '/run/redis.sock';
      const client = createClient({ path, lazyConnect: true }, {});
      expect(client).toBeDefined();
      expect(MockedRedis).toHaveBeenCalledTimes(1);
      expect(MockedRedis).toHaveBeenCalledWith(path, { lazyConnect: true });
      expect(MockedRedis.mock.instances).toHaveLength(1);
    });
  });

  describe('with options', () => {
    test('should create a client with options', () => {
      const options: RedisClientOptions = { host: '127.0.0.1', port: 6380 };
      const client = createClient(options, {});
      expect(client).toBeDefined();
      expect(MockedRedis).toHaveBeenCalledTimes(1);
      expect(MockedRedis).toHaveBeenCalledWith(options);
      expect(MockedRedis.mock.instances).toHaveLength(1);
    });

    test('should call onClientCreated', () => {
      const mockOnClientCreated = jest.fn();

      const client = createClient({ onClientCreated: mockOnClientCreated }, {});
      expect(client).toBeDefined();
      expect(MockedRedis).toHaveBeenCalledTimes(1);
      expect(MockedRedis).toHaveBeenCalledWith({});
      expect(MockedRedis.mock.instances).toHaveLength(1);
      expect(mockOnClientCreated).toHaveBeenCalledTimes(1);
      expect(mockOnClientCreated).toHaveBeenCalledWith(client);
    });
  });
});

describe('destroy', () => {
  let client1: Redis;
  let client2: Redis;
  let clients: RedisClients;

  beforeEach(() => {
    client1 = new Redis();
    client2 = new Redis();
    clients = new Map();
    clients.set('client1', client1);
    clients.set('client2', client2);
  });

  test('when the status is ready', async () => {
    Reflect.set(client1, 'status', 'ready');
    Reflect.set(client2, 'status', 'ready');

    const mockClient1Quit = jest.spyOn(client1, 'quit').mockRejectedValue(new Error());
    const mockClient2Quit = jest.spyOn(client2, 'quit').mockRejectedValue('');

    const results = await destroy(clients);
    expect(mockClient1Quit).toHaveBeenCalled();
    expect(mockClient2Quit).toHaveBeenCalled();
    expect(results).toHaveLength(2);
    expect(results[0][0]).toEqual({ status: 'fulfilled', value: 'client1' });
    expect(results[0][1]).toHaveProperty('status', 'rejected');
    expect(results[1][0]).toEqual({ status: 'fulfilled', value: 'client2' });
    expect(results[1][1]).toEqual({ status: 'rejected', reason: '' });
  });

  test('when the status is ready, end', async () => {
    Reflect.set(client1, 'status', 'ready');
    Reflect.set(client2, 'status', 'end');

    const mockClient1Quit = jest.spyOn(client1, 'quit').mockResolvedValue('OK');

    const results = await destroy(clients);
    expect(mockClient1Quit).toHaveBeenCalled();
    expect(results).toHaveLength(1);
  });

  test('when the status is wait', async () => {
    Reflect.set(client1, 'status', 'wait');
    Reflect.set(client2, 'status', 'wait');

    const mockClient1Disconnect = jest.spyOn(client1, 'disconnect');
    const mockClient2Disconnect = jest.spyOn(client2, 'disconnect');

    const results = await destroy(clients);
    expect(mockClient1Disconnect).toHaveBeenCalled();
    expect(mockClient2Disconnect).toHaveBeenCalled();
    expect(results).toHaveLength(0);
  });
});

describe('addListeners', () => {
  let client: Redis;

  beforeEach(() => {
    client = new Redis();
  });

  test('should set namespace correctly', () => {
    const namespace = Symbol();
    addListeners({ namespace, instance: client, readyLog: false, errorLog: false });
    expect(Reflect.get(client, NAMESPACE_KEY)).toBe(namespace);
  });

  test('should add ready listener', () => {
    mockOn.mockImplementation((_, fn: (...args: unknown[]) => void) => {
      fn.call(client);
    });
    addListeners({ namespace: '', instance: client, readyLog: true, errorLog: false });
    expect(mockOn).toHaveBeenCalledTimes(1);
  });

  test('should add error listener', () => {
    mockOn.mockImplementation((_, fn: (...args: unknown[]) => void) => {
      fn.call(client, new Error());
    });
    addListeners({ namespace: '', instance: client, readyLog: false, errorLog: true });
    expect(mockOn).toHaveBeenCalledTimes(1);
  });
});
