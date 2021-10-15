import * as allExports from '.';

test('should have 7 exports', () => {
    expect(Object.keys(allExports)).toHaveLength(7);
});

test('each of exports should be defined', () => {
    Object.values(allExports).forEach(value => expect(value).toBeDefined());
});
