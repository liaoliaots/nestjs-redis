import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import * as IORedis from 'ioredis';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('ioredis', () => require('ioredis-mock/jest'));

describe('CatsService', () => {
    let service: CatsService;
    let redis: IORedis.Redis;

    beforeEach(async () => {
        redis = new IORedis();

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: DEFAULT_REDIS_NAMESPACE, useValue: redis }, CatsService]
        }).compile();

        service = module.get<CatsService>(CatsService);
    });

    test('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        test('should return an array of cats', async () => {
            const get = jest.spyOn(redis, 'get');
            const set = jest.spyOn(redis, 'set');

            let cats;

            cats = await service.findAll();
            expect(cats).toHaveLength(2);
            expect(get.mock.calls).toHaveLength(1);
            expect(set.mock.calls).toHaveLength(1);
            expect(set.mock.calls[0][1]).toBe(JSON.stringify(cats));

            cats = await service.findAll();
            expect(cats).toHaveLength(2);
            expect(get.mock.calls).toHaveLength(2);
            expect(set.mock.calls).toHaveLength(1);
        });
    });

    describe('create', () => {
        test('should create a cat', async () => {
            const del = jest.spyOn(redis, 'del');

            const createCatDto: CreateCatDto = {
                name: 'Test Cat 3',
                age: 3,
                breed: 'Test Breed 3'
            };
            const newCat = await service.create(createCatDto);

            expect(newCat).toEqual({ id: 3, ...createCatDto });
            expect(del.mock.calls).toHaveLength(1);
        });
    });
});
