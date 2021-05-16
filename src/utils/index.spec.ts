import { isDefined, isEmpty, isNotEmpty } from './';

describe(isDefined.name, () => {
    const validValues = [0, 1, '', '0', false, true];
    const invalidValues = [undefined, null];

    test('should be true if method said that it is valid', () => {
        validValues.forEach(value => expect(isDefined(value)).toBe(true));
    });

    test('should be false if method said that it is invalid', () => {
        invalidValues.forEach(value => expect(isDefined(value)).toBe(false));
    });
});

describe(isEmpty.name, () => {
    const validValues = ['', undefined, null];
    const invalidValues = [0, 1, '0', false, true];

    test('should be true if method said that it is valid', () => {
        validValues.forEach(value => expect(isEmpty(value)).toBe(true));
    });

    test('should be false if method said that it is invalid', () => {
        invalidValues.forEach(value => expect(isEmpty(value)).toBe(false));
    });
});

describe(isNotEmpty.name, () => {
    const validValues = [0, 1, '0', false, true];
    const invalidValues = ['', undefined, null];

    test('should be true if method said that it is valid', () => {
        validValues.forEach(value => expect(isNotEmpty(value)).toBe(true));
    });

    test('should be false if method said that it is invalid', () => {
        invalidValues.forEach(value => expect(isNotEmpty(value)).toBe(false));
    });
});
