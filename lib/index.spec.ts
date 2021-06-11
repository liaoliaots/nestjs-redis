import * as all from '.';

test('should have 5 exports', () => {
    expect(Object.keys(all)).toHaveLength(5);
});

test('each of the exports should be defined', () => {
    Object.values(all).forEach(value => expect(value).toBeDefined());
});
