import { Test, TestingModule } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { AppModule } from '../src/app.module';

const testCatName = 'Test Cat 3';

describe('Cats', () => {
    let app: NestFastifyApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
        await app.init();
        await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/cats GET', () => {
        test('should return an array of cats', () => {
            return app
                .inject({
                    method: 'GET',
                    url: '/cats'
                })
                .then(res => {
                    expect(res.statusCode).toEqual(200);
                    expect(JSON.parse(res.payload)).toEqual([
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
                    payload: { name: testCatName, age: 3, breed: 'Test Breed 3' }
                })
                .then(res => {
                    expect(res.statusCode).toEqual(201);
                    expect(JSON.parse(res.payload)).toEqual({
                        id: 3,
                        name: testCatName,
                        age: 3,
                        breed: 'Test Breed 3'
                    });
                });
        });
    });
});
