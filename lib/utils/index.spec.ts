import IORedis from 'ioredis';
import { promiseTimeout, quitClients, testConfig } from '.';
import { RedisError } from '../errors';
import { RedisClients } from '../redis/interfaces';

describe(`${promiseTimeout.name}`, () => {
    const timeout = () =>
        new Promise<string>(resolve => {
            const id = setTimeout(() => {
                clearTimeout(id);
                resolve('resolved');
            }, 10);
        });

    test('should resolve promise when the time of executing promise less than ms', () => {
        return expect(promiseTimeout(20, timeout())).resolves.toBe('resolved');
    });

    test('should reject promise when the time of executing promise greater than ms', () => {
        return expect(promiseTimeout(0, timeout())).rejects.toBeInstanceOf(RedisError);
    });
});

describe(`${quitClients.name}`, () => {
    const clients: RedisClients = new Map();

    const timeout = () =>
        new Promise(resolve => {
            const id = setTimeout(() => {
                clearTimeout(id);
                resolve(undefined);
            }, 50);
        });

    beforeAll(async () => {
        clients.set('client0', new IORedis({ ...testConfig, db: 0 }));
        clients.set('client1', new IORedis({ ...testConfig, db: 1 }));

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

describe('testConfig', () => {
    test('the host should be of type string', () => {
        expect(typeof testConfig.host).toBe('string');
    });

    test('the port should be of type number', () => {
        expect(typeof testConfig.port).toBe('number');
    });

    test('the password should be of type string or undefined', () => {
        expect(typeof testConfig.password === 'string' || typeof testConfig.password === 'undefined').toBe(true);
    });
});
