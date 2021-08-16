import { Test } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { AppModule } from './app/app.module';
import { ClusterClients } from '../../lib/cluster/interfaces';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER_NAMESPACE } from '../../lib/cluster/cluster.constants';
import { quitClients } from '../../lib/cluster/common';

let clients: ClusterClients;

let app: NestFastifyApplication;

afterAll(async () => {
    quitClients(clients);
    await app.close();
});

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
    }).compile();
    clients = moduleRef.get<ClusterClients>(CLUSTER_CLIENTS);
    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
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
        await clients.get(DEFAULT_CLUSTER_NAMESPACE)?.quit();
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
