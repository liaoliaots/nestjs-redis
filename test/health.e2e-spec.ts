import { Test } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '../lib';
import { testConfig } from '../lib/utils';
import { RedisClients } from '../lib/redis/interfaces';
import { REDIS_CLIENTS, DEFAULT_REDIS_CLIENT } from '../lib/redis/redis.constants';
import { CLIENT_NOT_FOUND } from '../lib/errors';
import { quitClients } from '../lib/redis/common';
import { HealthController } from './controllers/health.controller';

let clients: RedisClients;

let app: NestFastifyApplication;

afterAll(async () => {
    quitClients(clients);

    await app.close();
});

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
            RedisModule.forRoot({ defaultOptions: testConfig, config: [{ namespace: 'client0', db: 0 }, { db: 1 }] }),
            TerminusModule
        ],
        controllers: [HealthController]
    }).compile();

    clients = moduleRef.get<RedisClients>(REDIS_CLIENTS);

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await app.getHttpAdapter().getInstance().ready();
});

test('/health (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual({
        status: 'ok',
        info: {
            client0: {
                status: 'up'
            },
            default: {
                status: 'up'
            }
        },
        error: {},
        details: {
            client0: {
                status: 'up'
            },
            default: {
                status: 'up'
            }
        }
    });
});

test('/health/with-unknown-namespace (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/health/with-unknown-namespace' });

    expect(res.statusCode).toBe(503);
    expect(JSON.parse(res.payload)).toEqual({
        status: 'error',
        info: {},
        error: {
            unknown: {
                status: 'down',
                message: CLIENT_NOT_FOUND('?')
            }
        },
        details: {
            unknown: {
                status: 'down',
                message: CLIENT_NOT_FOUND('?')
            }
        }
    });
});

describe('disconnect', () => {
    beforeEach(async () => {
        await clients.get(DEFAULT_REDIS_CLIENT)?.quit();
    });

    test('/health/with-disconnected-client (GET)', async () => {
        const res = await app.inject({ method: 'GET', url: '/health/with-disconnected-client' });

        expect(res.statusCode).toBe(503);
        expect(JSON.parse(res.payload)).toEqual({
            status: 'error',
            info: {},
            error: {
                default: {
                    status: 'down',
                    message: 'Connection is closed.'
                }
            },
            details: {
                default: {
                    status: 'down',
                    message: 'Connection is closed.'
                }
            }
        });
    });
});