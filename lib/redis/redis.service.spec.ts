import { Test, TestingModule } from '@nestjs/testing';
import IORedis from 'ioredis';
import { RedisService } from './redis.service';
import { RedisClients } from './interfaces';
import { REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE } from './redis.constants';

jest.mock('ioredis');

describe('RedisService', () => {
    let clients: RedisClients;
    let service: RedisService;

    beforeEach(async () => {
        clients = new Map();
        clients.set(DEFAULT_REDIS_NAMESPACE, new IORedis());
        clients.set('client1', new IORedis());

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisService]
        }).compile();

        service = module.get<RedisService>(RedisService);
    });

    test('should have 2 members', () => {
        expect(service.clients.size).toBe(2);
    });

    test('should get a client with namespace', () => {
        const client = service.getClient('client1');
        expect(client).toBeInstanceOf(IORedis);
    });

    test('should get default client with namespace', () => {
        const client = service.getClient(DEFAULT_REDIS_NAMESPACE);
        expect(client).toBeInstanceOf(IORedis);
    });

    test('should get default client without namespace', () => {
        const client = service.getClient();
        expect(client).toBeInstanceOf(IORedis);
    });

    test('should throw an error when getting a client with an unknown namespace', () => {
        expect(() => service.getClient('')).toThrow();
    });
});
