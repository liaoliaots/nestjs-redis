import { Test, TestingModule } from '@nestjs/testing';
import { getRedisToken, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import IORedis, { Redis } from 'ioredis';
import { CreateCatDto } from './create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './cat';

jest.mock('ioredis');

describe('CatsService', () => {
    let service: CatsService;
    let client: Redis;

    beforeEach(async () => {
        client = new IORedis();

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: getRedisToken(DEFAULT_REDIS_NAMESPACE), useValue: client }, CatsService]
        }).compile();

        service = module.get<CatsService>(CatsService);
    });

    test('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        test('should return the array of cats', async () => {
            const get = jest.spyOn(client, 'get').mockResolvedValue(null);
            const set = jest.spyOn(client, 'set');

            let cats: Cat[];
            cats = await service.findAll();
            expect(cats).toHaveLength(2);
            expect(cats[0]).toEqual({ id: 1, name: 'Test Cat 1', breed: 'Test Breed 1' });
            expect(get).toHaveBeenCalledTimes(1);
            expect(set).toHaveBeenCalledTimes(1);
            expect(set).toHaveBeenCalledWith('cats', JSON.stringify(cats));

            get.mockResolvedValue(JSON.stringify(cats));
            cats = await service.findAll();
            expect(cats).toHaveLength(2);
            expect(get).toHaveBeenCalledTimes(2);
            expect(set).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        test('should create the cat', async () => {
            const del = jest.spyOn(client, 'del');

            const createCatDto: CreateCatDto = {
                name: 'Test Cat 3',
                breed: 'Test Breed 3'
            };
            const newCat = await service.create(createCatDto);
            expect(newCat).toEqual({ id: 3, ...createCatDto });
            expect(del).toHaveBeenCalledTimes(1);
        });
    });
});
