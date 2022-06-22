import Redis from 'ioredis';
import { createClient, destroy } from './redis.utils';
import { RedisClients, RedisClientOptions } from '../interfaces';

jest.mock('ioredis', () =>
    jest.fn(() => ({
        on: jest.fn(),
        quit: jest.fn()
    }))
);

const MockRedis = Redis as jest.MockedClass<typeof Redis>;
beforeEach(() => {
    MockRedis.mockClear();
});

describe('createClient', () => {
    describe('with URL', () => {
        const url = 'redis://:authpassword@127.0.0.1:6380/4';

        test('should create a client with a URL', () => {
            const client = createClient({ url }, {});
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith(url, {});
            expect(MockRedis.mock.instances).toHaveLength(1);
        });

        test('should create a client with a URL and options', () => {
            const client = createClient({ url, lazyConnect: true }, {});
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith(url, { lazyConnect: true });
            expect(MockRedis.mock.instances).toHaveLength(1);
        });
    });

    describe('with path', () => {
        test('should create a client with path', () => {
            const path = '/run/redis.sock';
            const client = createClient({ path, lazyConnect: true }, {});
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith(path, { lazyConnect: true });
            expect(MockRedis.mock.instances).toHaveLength(1);
        });
    });

    describe('with options', () => {
        test('should create a client with options', () => {
            const options: RedisClientOptions = { host: '127.0.0.1', port: 6380 };
            const client = createClient(options, {});
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith(options);
            expect(MockRedis.mock.instances).toHaveLength(1);
        });

        test('should call onClientCreated', () => {
            const mockOnClientCreated = jest.fn();

            const client = createClient({ onClientCreated: mockOnClientCreated }, {});
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith({});
            expect(MockRedis.mock.instances).toHaveLength(1);
            expect(mockOnClientCreated).toHaveBeenCalledTimes(1);
            expect(mockOnClientCreated).toHaveBeenCalledWith(client);
        });

        // test('should add ready listener', () => {
        //     createClient({}, { readyLog: true });
        //     expect(mockOn).toHaveBeenCalled();
        // });
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
});
