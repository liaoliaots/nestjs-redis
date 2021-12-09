import * as allExports from '.';

test('there should be 14 exports', () => {
    expect(Object.keys(allExports)).toHaveLength(14);
});

test('each of exports should be defined', () => {
    Object.values(allExports).forEach(value => expect(value).toBeDefined());
});
