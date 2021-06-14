import IORedis, { Redis } from 'ioredis';
import { createClient, parseNamespace } from '.';
import { testConfig } from '../../utils';

const url = `redis://:${testConfig.password ?? ''}@127.0.0.1:${testConfig.port}/0`;

let client: Redis;

afterEach(async () => {
    await client.quit();
});

describe('url', () => {
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

describe('options', () => {
    test('should create client without options', () => {
        client = createClient({});

        expect(client).toBeInstanceOf(IORedis);
    });

    test('should create client with options', async () => {
        client = createClient({ ...testConfig });

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should call onClientCreated', () => {
        const mockCreated = jest.fn((client: Redis) => client);

        client = createClient({ ...testConfig, onClientCreated: mockCreated });

        expect(mockCreated.mock.calls).toHaveLength(1);
        expect(mockCreated.mock.results[0].value).toBeInstanceOf(IORedis);
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
        expect(parseNamespace(null)).toBe('unknown');
        expect(parseNamespace(false)).toBe('unknown');
    });
});
