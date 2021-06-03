import { Redis } from 'ioredis';
import { createClient, parseNamespace } from '.';

const port = 6380;
const password = '1519411258901';

const url = `redis://:${password}@127.0.0.1:${port}/0`;

let client: Redis;

afterEach(() => {
    if (client) client.disconnect();
});

describe('url', () => {
    test('should create client properly via URL', async () => {
        client = createClient({
            url
        });

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should create client properly via URL with options', async () => {
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

    test('should create client properly via options', async () => {
        client = createClient({
            port,
            password
        });

        const res = await client.ping();

        expect(res).toBe('PONG');
    });
});

describe(`${parseNamespace.name}`, () => {
    test('if the value is a string, the result should be equal to this string', () => {
        const value = 'client namespace';

        expect(parseNamespace(value)).toBe(value);
    });

    test('if the value is a symbol, the result should be equal to symbol.toString()', () => {
        const value = Symbol('client namespace');

        expect(parseNamespace(value)).toBe(value.toString());
    });

    test('if the value is neither string nor symbol, the result should be unknown', () => {
        expect(parseNamespace(undefined)).toBe('unknown');
    });
});
