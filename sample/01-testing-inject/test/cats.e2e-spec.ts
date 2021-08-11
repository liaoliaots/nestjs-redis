/* eslint-disable jest/expect-expect */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const testCatName = 'Test Cat 3';

describe('Cats', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/cats GET', () => {
        test('should return an array of cats', () => {
            return request(app.getHttpServer())
                .get('/cats')
                .expect(200, [
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

    describe('/cats POST', () => {
        test('should create a cat', () => {
            return request(app.getHttpServer())
                .post('/cats')
                .send({ name: testCatName, age: 3, breed: 'Test Breed 3' })
                .expect(201)
                .expect({
                    id: 3,
                    name: testCatName,
                    age: 3,
                    breed: 'Test Breed 3'
                });
        });
    });
});
