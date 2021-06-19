import { Test } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { RedisModule } from '../lib';
import { testConfig } from '../lib/utils';
import { RedisClients } from '../lib/redis/interfaces';
import { REDIS_CLIENTS } from '../lib/redis/redis.constants';
import { quitClients } from '../lib/redis/common';
import { InjectController } from './controllers/inject.controller';

let clients: RedisClients;

let app: NestFastifyApplication;

afterAll(async () => {
    quitClients(clients);

    await app.close();
});

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
            RedisModule.forRoot({ defaultOptions: testConfig, config: [{ namespace: 'client0', db: 0 }, { db: 1 }] })
        ],
        controllers: [InjectController]
    }).compile();

    clients = moduleRef.get<RedisClients>(REDIS_CLIENTS);

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await app.getHttpAdapter().getInstance().ready();
});

test('/inject/client0 (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/inject/client0' });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('PONG');
});

test('/inject/default (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/inject/default' });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('PONG');
});