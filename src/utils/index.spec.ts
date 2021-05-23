import { isDefined, isEmpty, isNotEmpty } from './';

describe(isDefined.name, () => {
    const validValues = [false, 0, '', NaN, true, 1, '0'];
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
    const invalidValues = [false, 0, NaN, true, 1, '0'];

    test('should be true if method said that it is valid', () => {
        validValues.forEach(value => expect(isEmpty(value)).toBe(true));
    });

    test('should be false if method said that it is invalid', () => {
        invalidValues.forEach(value => expect(isEmpty(value)).toBe(false));
    });
});

describe(isNotEmpty.name, () => {
    const validValues = [false, 0, NaN, true, 1, '0'];
    const invalidValues = ['', undefined, null];

    test('should be true if method said that it is valid', () => {
        validValues.forEach(value => expect(isNotEmpty(value)).toBe(true));
    });

    test('should be false if method said that it is invalid', () => {
        invalidValues.forEach(value => expect(isNotEmpty(value)).toBe(false));
    });
});
