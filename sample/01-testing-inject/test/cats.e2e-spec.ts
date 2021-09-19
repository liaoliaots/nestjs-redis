import { Test, TestingModule } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { DEFAULT_REDIS_NAMESPACE, getRedisToken } from '@liaoliaots/nestjs-redis';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { Redis } from 'ioredis';
import { AppModule } from '../src/app.module';
import { CreateCatDto } from '../src/cats/dto/create-cat.dto';

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
    });

    beforeEach(async () => {
        await client.del('cats');
    });

    afterEach(async () => {
        await client.del('cats');
    });

    afterAll(async () => {
        await app.close();
    });

    test('post cat, get all', async () => {
        const createCatDto: CreateCatDto = {
            name: 'Test Cat 3',
            breed: 'Test Breed 3'
        };
        const newCat = await app.inject({
            method: 'POST',
            url: '/cats',
            payload: createCatDto
        });
        expect(newCat.statusCode).toEqual(201);
        expect(JSON.parse(newCat.payload)).toEqual({
            id: 3,
            ...createCatDto
        });

        let cats: LightMyRequestResponse;
        cats = await app.inject({
            method: 'GET',
            url: '/cats'
        });
        expect(cats.statusCode).toEqual(200);
        expect(JSON.parse(cats.payload)).toEqual([
            {
                id: 1,
                name: 'Test Cat 1',
                breed: 'Test Breed 1'
            },
            {
                id: 2,
                name: 'Test Cat 2',
                breed: 'Test Breed 2'
            },
            { id: 3, name: 'Test Cat 3', breed: 'Test Breed 3' }
        ]);
        cats = await app.inject({
            method: 'GET',
            url: '/cats'
        });
        expect(cats.statusCode).toEqual(200);
        expect(JSON.parse(cats.payload)).toHaveLength(3);
    });
});
