import * as interfaces from './';

test('should export 2 interfaces', () => {
    expect(Object.keys(interfaces)).toHaveLength(2);
});

test('each of the interfaces must be defined', () => {
    Object.values(interfaces).forEach(value => {
        expect(value).not.toBeNull();
        expect(value).not.toBeUndefined();
    });
});
