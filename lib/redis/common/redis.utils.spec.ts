import Redis from 'ioredis';
import { createClient, quitClients, displayReadyLog, displayErrorLog } from './redis.utils';
import { RedisClients, RedisClientOptions } from '../interfaces';

jest.mock('../redis-logger', () => ({
    logger: {
        log: jest.fn(),
        error: jest.fn()
    }
}));

const mockOn = jest.fn();
const mockQuit = jest.fn();
const mockDisconnect = jest.fn();
jest.mock('ioredis', () =>
    jest.fn(() => ({
        on: mockOn,
        quit: mockQuit,
        disconnect: mockDisconnect
    }))
);

beforeEach(() => {
    mockOn.mockReset();
    mockQuit.mockReset();
    mockDisconnect.mockReset();
});

describe('createClient', () => {
    const MockRedis = Redis as jest.MockedClass<typeof Redis>;
    beforeEach(() => {
        MockRedis.mockClear();
    });

    describe('with a URL', () => {
        const url = `redis://:masterpassword1@127.0.0.1:6380/0`;

        test('should create a client with a URL', () => {
            const client = createClient({ url });
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith(url, {});
            expect(MockRedis.mock.instances).toHaveLength(1);
        });

        test('should create a client with a URL and options', () => {
            const client = createClient({ url, lazyConnect: true });
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith(url, { lazyConnect: true });
            expect(MockRedis.mock.instances).toHaveLength(1);
        });
    });

    describe('with options', () => {
        test('should create a client with options', () => {
            const options: RedisClientOptions = { host: '127.0.0.1', port: 6380 };
            const client = createClient(options);
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith(options);
            expect(MockRedis.mock.instances).toHaveLength(1);
        });

        test('should call onClientCreated', () => {
            const mockOnClientCreated = jest.fn();

            const client = createClient({ onClientCreated: mockOnClientCreated });
            expect(client).toBeDefined();
            expect(MockRedis).toHaveBeenCalledTimes(1);
            expect(MockRedis).toHaveBeenCalledWith({});
            expect(MockRedis.mock.instances).toHaveLength(1);
            expect(mockOnClientCreated).toHaveBeenCalledTimes(1);
            expect(mockOnClientCreated).toHaveBeenCalledWith(client);
        });
    });
});

describe('displayReadyLog', () => {
    let client: Redis;
    let clients: RedisClients;

    beforeEach(() => {
        client = new Redis();
        clients = new Map();
        clients.set('client', client);
    });

    test('should work correctly', () => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        mockOn.mockImplementation((_, fn: Function) => {
            fn();
        });
        displayReadyLog(clients);
        expect(mockOn).toHaveBeenCalledTimes(1);
    });
});

describe('displayErrorLog', () => {
    let client: Redis;
    let clients: RedisClients;

    beforeEach(() => {
        client = new Redis();
        clients = new Map();
        clients.set('client', client);
    });

    test('should work correctly', () => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        mockOn.mockImplementation((_, fn: Function) => {
            fn({ message: '' });
        });
        displayErrorLog(clients);
        expect(mockOn).toHaveBeenCalledTimes(1);
    });
});

describe('quitClients', () => {
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

    test('the status is ready', async () => {
        Reflect.defineProperty(client1, 'status', { value: 'ready' });
        Reflect.defineProperty(client2, 'status', { value: 'ready' });

        const mockClient1Quit = jest.spyOn(client1, 'quit').mockRejectedValue(new Error('a redis error'));
        const mockClient2Quit = jest.spyOn(client2, 'quit').mockRejectedValue('');

        const results = await quitClients(clients);
        expect(mockClient1Quit).toHaveBeenCalled();
        expect(mockClient2Quit).toHaveBeenCalled();
        expect(results).toHaveLength(2);
        expect(results[0][0]).toEqual({ status: 'fulfilled', value: 'client1' });
        expect(results[0][1]).toHaveProperty('status', 'rejected');
        expect(results[0][1]).toHaveProperty('reason');
        expect(results[1][0]).toEqual({ status: 'fulfilled', value: 'client2' });
        expect(results[1][1]).toEqual({ status: 'rejected', reason: '' });
    });

    test('the status is ready and end', async () => {
        Reflect.defineProperty(client1, 'status', { value: 'ready' });
        Reflect.defineProperty(client2, 'status', { value: 'end' });

        const mockClient1Quit = jest.spyOn(client1, 'quit').mockResolvedValue('OK');
        const mockClient2Disconnect = jest.spyOn(client2, 'disconnect');

        const results = await quitClients(clients);
        expect(mockClient1Quit).toHaveBeenCalled();
        expect(mockClient2Disconnect).toHaveBeenCalled();
        expect(results).toHaveLength(1);
    });
});
