import { Test } from '@nestjs/testing';
import { RedisHealthIndicator } from './redis.health';
import { REDIS_CLIENTS } from './redis.constants';
import { createClient } from './common';
import { RedisService } from './redis.service';
import { RedisClients } from './interfaces';

const port = 6380;
const password = '1519411258901';

describe(`${RedisHealthIndicator.name}`, () => {
    const clients: RedisClients = new Map();

    let redisHealth: RedisHealthIndicator;

    afterAll(() => {
        [...clients.values()].forEach(client => client.disconnect());
    });

    beforeAll(async () => {
        clients.set(
            'client0',
            createClient({
                port,
                password,
                retryStrategy: () => null
            })
        );

        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: REDIS_CLIENTS,
                    useValue: clients
                },
                RedisService,
                RedisHealthIndicator
            ]
        }).compile();

        redisHealth = moduleRef.get<RedisHealthIndicator>(RedisHealthIndicator);
    });

    test('should state up', () => {
        return expect(redisHealth.pingCheck('redis', { clientNamespace: 'client0' })).resolves.toEqual({
            redis: { status: 'up' }
        });
    });
});
