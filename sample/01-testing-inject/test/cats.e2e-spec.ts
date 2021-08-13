import { Test, TestingModule } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { DEFAULT_REDIS_CLIENT } from '@liaoliaots/nestjs-redis';
import { FastifyInstance } from 'fastify';
import { Redis } from 'ioredis';
import { AppModule } from '../src/app.module';

const testCatName3 = 'Test Cat 3';

describe('CatsController (e2e)', () => {
    let app: NestFastifyApplication;
    let redisClientDefault: Redis;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        redisClientDefault = module.get<Redis>(DEFAULT_REDIS_CLIENT, { strict: false });
        app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

        await redisClientDefault.flushdb();
        await app.init();
        await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
    });

    afterAll(async () => {
        await redisClientDefault.flushdb();
        await app.close();
    });

    describe('/cats GET', () => {
        test('should return an array of cats', () => {
            return app
                .inject({
                    method: 'GET',
                    url: '/cats'
                })
                .then(response => {
                    expect(response.statusCode).toEqual(200);
                    expect(JSON.parse(response.payload)).toEqual([
                        {
                            id: 1,
                            name: 'Test Cat 1',
                            age: 1,
                            breed: 'Test Breed 1'
                        },
                        {
                            id: 2,
                            name: 'Test Cat 2',
                            age: 2,
                            breed: 'Test Breed 2'
                        }
                    ]);
                });
        });
    });

    describe('/cats POST', () => {
        test('should create a cat', () => {
            return app
                .inject({
                    method: 'POST',
                    url: '/cats',
                    payload: { name: testCatName3, age: 3, breed: 'Test Breed 3' }
                })
                .then(response => {
                    expect(response.statusCode).toEqual(201);
                    expect(JSON.parse(response.payload)).toEqual({
                        id: 3,
                        name: testCatName3,
                        age: 3,
                        breed: 'Test Breed 3'
                    });
                });
        });
    });
});
