import IORedis, { Redis } from 'ioredis';
import { createClient, parseNamespace } from '.';

const port = 6380;
const password = '1519411258901';

const url = `redis://:${password}@127.0.0.1:${port}/0`;

let client: Redis;

afterEach(() => {
    if (client) client.disconnect();
});

describe('url', () => {
    test('should create client via URL', async () => {
        client = createClient({
            url
        });

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should create client via URL with options', async () => {
        client = createClient({
            url,
            lazyConnect: true
        });

        expect(client.status).toBe('wait');

        const res = await client.ping();

        expect(res).toBe('PONG');
    });
});

describe('options', () => {
    test('should throw an error when creating a client via empty options on the redis server with a password', async () => {
        client = createClient({});

        const err = await new Promise(resolve => {
            client.once('error', err => resolve(err));
        });

        expect(err).toBeDefined();
    });

    test('should create client via options', async () => {
        client = createClient({
            port,
            password
        });

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should call onClientCreated', async () => {
        const mockCreated = jest.fn((client: Redis) => client);

        client = createClient({
            port,
            password,
            onClientCreated: mockCreated
        });

        expect(mockCreated.mock.calls).toHaveLength(1);
        expect(mockCreated.mock.results[0].value).toBeInstanceOf(IORedis);

        const res = await (mockCreated.mock.results[0].value as Redis).ping();

        expect(res).toBe('PONG');
    });
});

describe(`${parseNamespace.name}`, () => {
    test('if value is a string, the result should be equal to this string', () => {
        const value = 'client namespace';

        expect(parseNamespace(value)).toBe(value);
    });

    test('if value is a symbol, the result should be equal to value.toString()', () => {
        const value = Symbol('client namespace');

        expect(parseNamespace(value)).toBe(value.toString());
    });

    test('if value is neither string nor symbol, the result should be unknown', () => {
        expect(parseNamespace(undefined)).toBe('unknown');
        expect(parseNamespace(null)).toBe('unknown');
        expect(parseNamespace(false)).toBe('unknown');
    });
});
