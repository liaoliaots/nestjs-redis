import { Test } from '@nestjs/testing';
import IORedis from 'ioredis';
import { RedisService } from './redis.service';
import { RedisClients } from './interfaces';
import { REDIS_CLIENTS, DEFAULT_REDIS_CLIENT } from './redis.constants';
import { quitClients } from './common';
import { testConfig } from '../../jest-env';

describe(`${RedisService.name}`, () => {
    const clients: RedisClients = new Map();

    let redisService: RedisService;

    afterAll(() => {
        quitClients(clients);
    });

    beforeAll(async () => {
        clients.set('client0', new IORedis({ ...testConfig.master, db: 0 }));
        clients.set(DEFAULT_REDIS_CLIENT, new IORedis({ ...testConfig.master, db: 1 }));

        const moduleRef = await Test.createTestingModule({
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisService]
        }).compile();

        redisService = moduleRef.get<RedisService>(RedisService);
    });

    test('the size of property clients should be equal to clients.size', () => {
        expect(redisService.clients.size).toBe(clients.size);
    });

    test('should get client with namespace', async () => {
        const client = redisService.getClient('client0');

        expect(client.options.db).toBe(0);

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should get default client with namespace', async () => {
        const client = redisService.getClient(DEFAULT_REDIS_CLIENT);

        expect(client.options.db).toBe(1);

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should get default client without namespace', async () => {
        const client = redisService.getClient();

        expect(client.options.db).toBe(1);

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should throw an error while getting client with an unknown namespace', () => {
        expect(() => redisService.getClient('')).toThrow();
    });
});
