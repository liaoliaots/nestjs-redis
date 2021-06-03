import { Redis } from 'ioredis';
import { createClient, parseNamespace } from './redis-utils';

let client: Redis;

afterEach(() => {
    if (client) client.disconnect();
});

describe('url', () => {
    const url = 'redis://:1519411258901@127.0.0.1:6380/0';

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
    test('should get an error when creating client properly via empty options on the redis server with a password', async () => {
        client = createClient({});

        const err = await new Promise(resolve => {
            client.once('error', err => resolve(err));
        });

        expect(err).toBeDefined();
    });

    test('should create client properly via options', async () => {
        client = createClient({
            port: 6380,
            password: '1519411258901'
        });

        const res = await client.ping();

        expect(res).toBe('PONG');
    });
});

describe(`${parseNamespace.name}`, () => {
    test('if the value is a string, the result should be equal to this string', () => {
        const value = 'a namespace';

        expect(parseNamespace(value)).toBe(value);
    });

    test('if the value is a symbol, the result should be equal to symbol.toString()', () => {
        const value = Symbol('a namespace');

        expect(parseNamespace(value)).toBe(value.toString());
    });

    test('if the value is neither string nor symbol, the result should be unknown', () => {
        const value = undefined;

        expect(parseNamespace(value)).toBe('unknown');
    });
});
