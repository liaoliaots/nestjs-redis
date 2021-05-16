import * as allExports from './';

test('should have 1 exports', () => {
    expect(Object.keys(allExports)).toHaveLength(1);
});
