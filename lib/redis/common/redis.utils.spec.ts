import IORedis, { Redis } from 'ioredis';
import { createClient, quitClients } from './redis.utils';
import { RedisClients, ClientOptions } from '../interfaces';

jest.mock('ioredis');
const MockIORedis = IORedis as jest.MockedClass<typeof IORedis>;

beforeEach(() => {
    MockIORedis.mockReset();
});

describe('createClient', () => {
    describe('with a URL', () => {
        const url = `redis://:masterpassword1@127.0.0.1:6380/0`;

        test('should create a client with a URL', () => {
            const client = createClient({ url });
            expect(MockIORedis).toHaveBeenCalledTimes(1);
            expect(MockIORedis).toHaveBeenCalledWith(url, {});
            expect(client).toBeInstanceOf(IORedis);
        });

        test('should create a client with a URL and options', () => {
            const client = createClient({ url, lazyConnect: true });
            expect(MockIORedis).toHaveBeenCalledTimes(1);
            expect(MockIORedis).toHaveBeenCalledWith(url, { lazyConnect: true });
            expect(client).toBeInstanceOf(IORedis);
        });
    });

    describe('with options', () => {
        test('should create a client with options', () => {
            const options: ClientOptions = { host: '127.0.0.1', port: 6380 };
            const client = createClient(options);
            expect(MockIORedis).toHaveBeenCalledTimes(1);
            expect(MockIORedis).toHaveBeenCalledWith(options);
            expect(client).toBeInstanceOf(IORedis);
        });

        test('should call onClientCreated', () => {
            const mockOnClientCreated = jest.fn();

            const client = createClient({ onClientCreated: mockOnClientCreated });
            expect(MockIORedis).toHaveBeenCalledTimes(1);
            expect(MockIORedis).toHaveBeenCalledWith({});
            expect(client).toBeInstanceOf(IORedis);
            expect(mockOnClientCreated).toHaveBeenCalledTimes(1);
            expect(mockOnClientCreated).toHaveBeenCalledWith(client);
        });
    });
});

describe('quitClients', () => {
    let client1: Redis;
    let client2: Redis;
    let clients: RedisClients;

    beforeEach(() => {
        client1 = new IORedis();
        client2 = new IORedis();
        clients = new Map();
        clients.set('client1', client1);
        clients.set('client2', client2);
    });

    test('when the status is ready', () => {
        Reflect.defineProperty(client1, 'status', { value: 'ready' });
        Reflect.defineProperty(client2, 'status', { value: 'ready' });

        const mockClient1Quit = jest.spyOn(client1, 'quit').mockRejectedValue(new Error('a redis error'));
        const mockClient2Quit = jest.spyOn(client2, 'quit').mockRejectedValue('');

        quitClients(clients);
        expect(mockClient1Quit).toHaveBeenCalledTimes(1);
        expect(mockClient2Quit).toHaveBeenCalledTimes(1);
    });

    test('when the status is ready and end', () => {
        Reflect.defineProperty(client1, 'status', { value: 'ready' });
        Reflect.defineProperty(client2, 'status', { value: 'end' });

        const mockClient1Quit = jest.spyOn(client1, 'quit').mockResolvedValue('OK');
        const mockClient2Disconnect = jest.spyOn(client2, 'disconnect');

        quitClients(clients);
        expect(mockClient1Quit).toHaveBeenCalledTimes(1);
        expect(mockClient2Disconnect).toHaveBeenCalledTimes(1);
    });
});
