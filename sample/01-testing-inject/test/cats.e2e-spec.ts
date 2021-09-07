import { Test, TestingModule } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { DEFAULT_REDIS_NAMESPACE, getRedisToken } from '@liaoliaots/nestjs-redis';
import { FastifyInstance } from 'fastify';
import { Redis } from 'ioredis';
import { AppModule } from '../src/app.module';

const testCat3 = 'Test Cat 3';

describe('CatsController (e2e)', () => {
    let app: NestFastifyApplication;
    let client: Redis;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        client = module.get<Redis>(getRedisToken(DEFAULT_REDIS_NAMESPACE));
        app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

        await app.init();
        await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
        await client.flushdb();
    });

    afterAll(async () => {
        await client.flushdb();
        await app.close();
    });

    describe('/cats GET', () => {
        test('should return an array of cats', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/cats'
            });
            expect(res.statusCode).toEqual(200);
            expect(JSON.parse(res.payload)).toEqual([
                {
                    id: 1,
                    name: 'Test Cat 1',
                    breed: 'Test Breed 1'
                },
                {
                    id: 2,
                    name: 'Test Cat 2',
                    breed: 'Test Breed 2'
                }
            ]);
        });
    });

    describe('/cats POST', () => {
        test('should create a cat', async () => {
            const res = await app.inject({
                method: 'POST',
                url: '/cats',
                payload: { name: testCat3, breed: 'Test Breed 3' }
            });
            expect(res.statusCode).toEqual(201);
            expect(JSON.parse(res.payload)).toEqual({
                id: 3,
                name: testCat3,
                breed: 'Test Breed 3'
            });
        });
    });
});
