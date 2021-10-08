import { Test, TestingModule } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { AppModule } from '../src/app.module';
import { timeout } from '../../helpers';

describe('HealthController (e2e)', () => {
    let app: NestFastifyApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

        await app.init();
        await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
        await timeout(100);
    });

    afterAll(async () => {
        await app.close();
    });

    test('/health (GET)', async () => {
        const res = await app.inject({ method: 'GET', url: '/health' });
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.payload)).toEqual({
            status: 'ok',
            info: {
                default: {
                    status: 'up'
                },
                client1: {
                    status: 'up'
                }
            },
            error: {},
            details: {
                default: {
                    status: 'up'
                },
                client1: {
                    status: 'up'
                }
            }
        });
    });
});
