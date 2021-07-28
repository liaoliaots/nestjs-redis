import { Test } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { RedisClients } from '../../lib/redis/interfaces';
import { REDIS_CLIENTS, DEFAULT_REDIS_CLIENT } from '../../lib/redis/redis.constants';
import { quitClients } from '../../lib/redis/common';

let clients: RedisClients;

let app: NestFastifyApplication;

afterAll(async () => {
    quitClients(clients);

    await app.close();
});

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
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
