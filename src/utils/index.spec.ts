import { isDefined, isEmpty, isNotEmpty } from './';

describe(isDefined.name, () => {
    test('if value is empty string, the result should be true', () => {
        expect(isDefined('')).toBeTruthy();
    });

    test('if value is undefined, the result should be false', () => {
        expect(isDefined(undefined)).toBeFalsy();
    });

    test('if value is null, the result should be false', () => {
        expect(isDefined(null)).toBeFalsy();
    });

    test('if value is 0, the result should be true', () => {
        expect(isDefined(0)).toBeTruthy();
    });

    test('if value is false, the result should be true', () => {
        expect(isDefined(false)).toBeTruthy();
    });
});

describe(isEmpty.name, () => {
    test('if value is empty string, the result should be true', () => {
        expect(isEmpty('')).toBeTruthy();
    });

    test('if value is undefined, the result should be true', () => {
        expect(isEmpty(undefined)).toBeTruthy();
    });

    test('if value is null, the result should be true', () => {
        expect(isEmpty(null)).toBeTruthy();
    });

    test('if value is 0, the result should be false', () => {
        expect(isEmpty(0)).toBeFalsy();
    });

    test('if value is false, the result should be false', () => {
        expect(isEmpty(false)).toBeFalsy();
    });
});

describe(isNotEmpty.name, () => {
    test('if value is empty string, the result should be false', () => {
        expect(isNotEmpty('')).toBeFalsy();
    });

    test('if value is undefined, the result should be false', () => {
        expect(isNotEmpty(undefined)).toBeFalsy();
    });

    test('if value is null, the result should be false', () => {
        expect(isNotEmpty(null)).toBeFalsy();
    });

    test('if value is 0, the result should be true', () => {
        expect(isNotEmpty(0)).toBeTruthy();
    });

    test('if value is false, the result should be true', () => {
        expect(isNotEmpty(false)).toBeTruthy();
    });
});
