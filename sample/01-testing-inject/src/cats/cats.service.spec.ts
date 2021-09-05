import { Test, TestingModule } from '@nestjs/testing';
import { getRedisToken, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import IORedis, { Redis } from 'ioredis';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './cat.model';

jest.mock('ioredis');

describe('CatsService', () => {
    let service: CatsService;
    let defaultClient: Redis;

    beforeEach(async () => {
        defaultClient = new IORedis();

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: getRedisToken(DEFAULT_REDIS_NAMESPACE), useValue: defaultClient }, CatsService]
        }).compile();

        service = module.get<CatsService>(CatsService);
    });

    test('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        test('should return an array of cats', async () => {
            const get = jest.spyOn(defaultClient, 'get').mockResolvedValue(null);
            const set = jest.spyOn(defaultClient, 'set');

            let cats: Cat[];

            cats = await service.findAll();
            expect(cats).toHaveLength(2);
            expect(get.mock.calls).toHaveLength(1);
            expect(set.mock.calls).toHaveLength(1);
            expect(set.mock.calls[0][1]).toBe(JSON.stringify(cats));

            get.mockResolvedValue(JSON.stringify(cats));
            cats = await service.findAll();
            expect(cats).toHaveLength(2);
            expect(get.mock.calls).toHaveLength(2);
            expect(set.mock.calls).toHaveLength(1);
        });
    });

    describe('create', () => {
        test('should create a cat', async () => {
            const del = jest.spyOn(defaultClient, 'del');

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
