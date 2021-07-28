import * as allExports from '.';

test('should have 10 exports', () => {
    expect(Object.keys(allExports)).toHaveLength(8);
});

test('each of exports should be defined', () => {
    Object.values(allExports).forEach(value => expect(value).toBeDefined());
});
