import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

const testCat3 = 'Test Cat 3';

describe('CatsController', () => {
    let controller: CatsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CatsController],
            providers: [
                {
                    provide: CatsService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([
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
                        ]),
                        create: jest.fn().mockResolvedValue({ id: 3, name: testCat3, breed: 'Test Breed 3' })
                    }
                }
            ]
        }).compile();

        controller = module.get<CatsController>(CatsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        test('should get the list of cats', async () => {
            const cats = await controller.findAll();
            expect(cats).toHaveLength(2);
            expect(cats[0].id).toBe(1);
            expect(cats[1].name).toBe('Test Cat 2');
        });
    });

    describe('create', () => {
        test('should return a new cat', async () => {
            const newCat = await controller.create({ name: testCat3, breed: 'Test Breed 3' });
            expect(newCat.id).toBe(3);
            expect(newCat.name).toBe(testCat3);
        });
    });
});
