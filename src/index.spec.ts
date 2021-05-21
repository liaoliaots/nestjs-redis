import * as allExports from './';
import { isDefined } from './utils';

test('should have 1 exports', () => {
    expect(Object.keys(allExports)).toHaveLength(1);
});

test('each of exports should be defined', () => {
    Object.values(allExports).forEach(value => expect(isDefined(value)).toBe(true));
});
