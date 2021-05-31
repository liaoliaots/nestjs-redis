import * as interfaces from './';

test('should export 4 interfaces', () => {
    expect(Object.keys(interfaces)).toHaveLength(4);
});

test('each of the interfaces must be defined', () => {
    Object.values(interfaces).forEach(value => {
        expect(value).not.toBeNull();
        expect(value).not.toBeUndefined();
    });
});
