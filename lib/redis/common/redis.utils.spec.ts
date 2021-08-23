import IORedis, { Redis } from 'ioredis';
import { createClient, quitClients } from './redis.utils';
import { RedisClients } from '../interfaces';

jest.mock('ioredis');
const IORedisMock = IORedis as jest.MockedClass<typeof IORedis>;

beforeEach(() => {
    IORedisMock.mockReset();
});

describe('createClient', () => {
    describe('with a URL', () => {
        const url = `redis://:authpassword@127.0.0.1:6380/0`;

        test('should create a client with a URL', () => {
            const client = createClient({ url });
            expect(IORedisMock).toHaveBeenCalledTimes(1);
            expect(IORedisMock).toHaveBeenCalledWith(url, {});
            expect(client).toBeInstanceOf(IORedis);
        });

        test('should create a client with a URL and options', () => {
            const client = createClient({ url, lazyConnect: true });
            expect(IORedisMock).toHaveBeenCalledTimes(1);
            expect(IORedisMock).toHaveBeenCalledWith(url, { lazyConnect: true });
            expect(client).toBeInstanceOf(IORedis);
        });
    });

    describe('with options', () => {
        test('should create a client with options', () => {
            const client = createClient({ host: '127.0.0.1', port: 6380 });
            expect(IORedisMock).toHaveBeenCalledTimes(1);
            expect(IORedisMock).toHaveBeenCalledWith({ host: '127.0.0.1', port: 6380 });
            expect(client).toBeInstanceOf(IORedis);
        });

        test('should call onClientCreated', () => {
            const mockOnClientCreated = jest.fn();

            const client = createClient({ onClientCreated: mockOnClientCreated });
            expect(IORedisMock).toHaveBeenCalledTimes(1);
            expect(IORedisMock).toHaveBeenCalledWith({});
            expect(client).toBeInstanceOf(IORedis);
            expect(mockOnClientCreated).toHaveBeenCalledTimes(1);
            expect(mockOnClientCreated).toHaveBeenCalledWith(client);
        });
    });
});

describe('quitClients', () => {
    let client0: Redis;
    let client1: Redis;
    const clients: RedisClients = new Map();

    beforeEach(() => {
        client0 = new IORedis();
        client1 = new IORedis();
        clients.set('client0', client0);
        clients.set('client1', client1);
    });

    test('when the status is ready', async () => {
        Reflect.defineProperty(client0, 'status', { value: 'ready' });
        Reflect.defineProperty(client1, 'status', { value: 'ready' });

        const mockClient0Quit = jest.spyOn(client0, 'quit').mockResolvedValue('OK');
        const mockClient1Quit = jest.spyOn(client1, 'quit').mockResolvedValue('OK');

        const results = await quitClients(clients);
        expect(results).toHaveLength(2);
        results.forEach(result => expect(result.status).toBe('fulfilled'));
        expect(mockClient0Quit).toHaveBeenCalledTimes(1);
        expect(mockClient1Quit).toHaveBeenCalledTimes(1);
    });

    test('when the status is ready and end', async () => {
        Reflect.defineProperty(client0, 'status', { value: 'ready' });
        Reflect.defineProperty(client1, 'status', { value: 'end' });

        const mockClient0Quit = jest.spyOn(client0, 'quit').mockResolvedValue('OK');
        const mockClient1Disconnect = jest.spyOn(client1, 'disconnect');

        const results = await quitClients(clients);
        expect(results).toHaveLength(1);
        results.forEach(result => expect(result.status).toBe('fulfilled'));
        expect(mockClient0Quit).toHaveBeenCalledTimes(1);
        expect(mockClient1Disconnect).toHaveBeenCalledTimes(1);
    });
});
