import IORedis, { Redis } from 'ioredis';
import { createClient, quitClients } from '.';
import { testConfig } from '../../../jest-env';
import { RedisClients } from '../interfaces';

const url = `redis://:${testConfig.master.password}@${testConfig.master.host}:${testConfig.master.port}/0`;

describe(`${createClient.name}`, () => {
    let client: Redis;

    afterEach(async () => {
        await client.quit();
    });

    describe('with URL', () => {
        test('should create client with URL', async () => {
            client = createClient({ url });

            const res = await client.ping();

            expect(res).toBe('PONG');
        });

        test('should create client with URL and options', async () => {
            client = createClient({ url, lazyConnect: true });

            expect(client.status).toBe('wait');

            const res = await client.ping();

            expect(res).toBe('PONG');
        });
    });

    describe('with options', () => {
        test('should create client without options', () => {
            client = createClient({});

            expect(client).toBeInstanceOf(IORedis);
        });

        test('should create client with options', async () => {
            client = createClient({ ...testConfig.master });

            const res = await client.ping();

            expect(res).toBe('PONG');
        });

        test('should call onClientCreated', () => {
            const mockCreated = jest.fn((client: Redis) => client);

            client = createClient({ ...testConfig.master, onClientCreated: mockCreated });

            expect(mockCreated.mock.calls).toHaveLength(1);
            expect(mockCreated.mock.results[0].value).toBeInstanceOf(IORedis);
        });
    });
});

describe(`${quitClients.name}`, () => {
    const clients: RedisClients = new Map();

    const timeout = () =>
        new Promise(resolve => {
            const id = setTimeout(() => {
                clearTimeout(id);
                resolve(undefined);
            }, 100);
        });

    beforeAll(async () => {
        clients.set('client0', new IORedis({ ...testConfig.master, db: 0 }));
        clients.set('client1', new IORedis({ ...testConfig.master, db: 1 }));

        await timeout();
    });

    test('the state should be ready', () => {
        clients.forEach(client => expect(client.status).toBe('ready'));
    });

    test('the state should be end', async () => {
        quitClients(clients);

        await timeout();

        clients.forEach(client => expect(client.status).toBe('end'));
    });
});
