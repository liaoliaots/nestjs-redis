import { Test } from '@nestjs/testing';
import IORedis from 'ioredis';
import { RedisService } from './redis.service';
import { RedisClients } from './interfaces';
import { REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE } from './redis.constants';
import { quitClients } from './common';
import { testConfig } from '../../test/env';

describe(`${RedisService.name}`, () => {
    const clients: RedisClients = new Map();

    let redisService: RedisService;

    afterAll(() => {
        quitClients(clients);
    });

    beforeAll(async () => {
        clients.set('client0', new IORedis({ ...testConfig.master, db: 0 }));
        clients.set(DEFAULT_REDIS_NAMESPACE, new IORedis({ ...testConfig.master, db: 1 }));

        const moduleRef = await Test.createTestingModule({
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisService]
        }).compile();

        redisService = moduleRef.get<RedisService>(RedisService);
    });

    test('the size should be equal to clients.size', () => {
        expect(redisService.clients.size).toBe(clients.size);
    });

    test('should get a client with namespace', async () => {
        const client = redisService.getClient('client0');

        await expect(client.ping()).resolves.toBeDefined();
    });

    test('should get default client with namespace', async () => {
        const client = redisService.getClient(DEFAULT_REDIS_NAMESPACE);

        await expect(client.ping()).resolves.toBeDefined();
    });

    test('should get default client without namespace', async () => {
        const client = redisService.getClient();

        await expect(client.ping()).resolves.toBeDefined();
    });

    test('should throw an error when getting a client with an unknown namespace', () => {
        expect(() => redisService.getClient('')).toThrow();
    });
});
