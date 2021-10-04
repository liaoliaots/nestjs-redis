import { Cat } from './cat';

describe('Cat', () => {
    test('should create a cat with all fields', () => {
        const cat = new Cat(1, 'test', 'breed');
        expect(cat.id).toBe(1);
        expect(cat.name).toBe('test');
        expect(cat.breed).toBe('breed');
    });
});
