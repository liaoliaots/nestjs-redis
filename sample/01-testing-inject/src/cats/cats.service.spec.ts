import { Test, TestingModule } from '@nestjs/testing';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { CreateCatDto } from './create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './cat';

describe('CatsService', () => {
    let service: CatsService;
    let get: jest.Mock;
    let set: jest.Mock;
    let del: jest.Mock;

    beforeEach(async () => {
        get = jest.fn();
        set = jest.fn();
        del = jest.fn();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CatsService,
                {
                    provide: getRedisToken('default'),
                    useValue: {
                        get,
                        set,
                        del
                    }
                }
            ]
        }).compile();

        service = module.get<CatsService>(CatsService);
    });

    test('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        test('should return the array of cats', async () => {
            let cats: Cat[];

            get.mockResolvedValue(null);
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
