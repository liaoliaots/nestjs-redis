import IORedis, { Redis } from 'ioredis';
import { mocked } from 'ts-jest/utils';
import { createClient, quitClients } from './redis.utils';
import { RedisClients } from '../interfaces';

jest.mock('ioredis', () => ({
    __esModule: true,
    default: jest.fn(() => {
        return {
            ping: jest.fn().mockResolvedValue('PONG')
        };
    })
}));

const mockIORedis = IORedis as jest.MockedClass<typeof IORedis>;

describe('createClient', () => {
    let client: IORedis.Redis;

    describe('with a URL', () => {
        const url = `redis://:authpassword@127.0.0.1:6380/0`;

        test('should create a client with a URL', async () => {
            client = createClient({ url });
            expect(mockIORedis).toHaveBeenCalledTimes(1);
            expect(mockIORedis).toHaveBeenCalledWith(url, {});
            await expect(client.ping()).resolves.toBe('PONG');
        });

        // test('should create a client with a URL and options', async () => {
        //     client = createClient({ url, lazyConnect: true });
        //     expect(client.status).toBe('wait');
        //     await expect(client.ping()).resolves.toBeDefined();
        // });
    });

    // describe('with options', () => {
    //     test('should create a client with options', async () => {
    //         client = createClient({ ...testConfig.master });
    //         await expect(client.ping()).resolves.toBeDefined();
    //     });

    //     test('should create a client with empty options', () => {
    //         client = createClient({});
    //         expect(client).toBeInstanceOf(IORedis);
    //     });

    //     test('should call onClientCreated', () => {
    //         const mockOnClientCreated = jest.fn((client: Redis) => client);

    //         client = createClient({ ...testConfig.master, onClientCreated: mockOnClientCreated });
    //         expect(mockOnClientCreated.mock.calls).toHaveLength(1);
    //         expect(mockOnClientCreated.mock.results[0].value).toBeInstanceOf(IORedis);
    //     });
    // });
});

// describe('quitClients', () => {
//     const clients: RedisClients = new Map();

//     const timeout = () =>
//         new Promise<void>(resolve => {
//             const id = setTimeout(() => {
//                 clearTimeout(id);
//                 resolve();
//             }, 50);
//         });

//     beforeAll(async () => {
//         clients.set('client0', new IORedis(testConfig.master));
//         clients.set('client1', new IORedis(testConfig.master));

//         await timeout();
//     });

//     test('should work correctly', async () => {
//         clients.forEach(client => expect(client.status).toBe('ready'));
//         const results = await quitClients(clients);
//         expect(results).toHaveLength(2);
//         results.forEach(result => expect(result.status).toBe('fulfilled'));

//         await timeout();
//         clients.forEach(client => expect(client.status).toBe('end'));
//     });
// });
