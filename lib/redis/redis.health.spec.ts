import { Test } from '@nestjs/testing';
import IORedis from 'ioredis';
import { RedisHealthIndicator } from './redis.health';
import { REDIS_CLIENTS } from './redis.constants';
import { RedisService } from './redis.service';
import { RedisClients } from './interfaces';
import { quitClients } from './common';
import { testConfig } from '../../test/env';

describe(`${RedisHealthIndicator.name}`, () => {
    const clients: RedisClients = new Map();

    let redisHealth: RedisHealthIndicator;

    afterAll(() => {
        quitClients(clients);
    });

    beforeAll(async () => {
        clients.set('client0', new IORedis({ ...testConfig.master }));

        const moduleRef = await Test.createTestingModule({
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisService, RedisHealthIndicator]
        }).compile();

        redisHealth = moduleRef.get<RedisHealthIndicator>(RedisHealthIndicator);
    });

    test('should state up', () => {
        return expect(redisHealth.isHealthy('redis', { namespace: 'client0' })).resolves.toEqual({
            redis: { status: 'up' }
        });
    });
});
