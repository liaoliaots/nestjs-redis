import { CreateCatDto } from './create-cat.dto';

describe('CreateCatDto', () => {
    test('should create a createCatDto', () => {
        const createCatDto = new CreateCatDto('test', 'breed');
        expect(createCatDto.name).toBe('test');
        expect(createCatDto.breed).toBe('breed');
    });
});
