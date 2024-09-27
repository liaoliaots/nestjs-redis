import * as allExports from '.';

test('each of exports should be defined', () => {
  Object.values(allExports).forEach(value => expect(value).not.toBeNil());
});
