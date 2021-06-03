import { Injectable, ValueProvider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRedisClient, namespaces } from '.';
import { DEFAULT_REDIS_CLIENT } from '../redis.constants';

describe(`${InjectRedisClient.name}`, () => {
    const _name: ValueProvider<string> = { provide: 'name', useValue: 'liaoliao' };
    const _gender: ValueProvider<string> = { provide: Symbol('gender'), useValue: 'female' };
    const _default: ValueProvider<string> = {
        provide: DEFAULT_REDIS_CLIENT,
        useValue: 'default'
    };

    @Injectable()
    class TestName {
        constructor(@InjectRedisClient(_name.provide as string) public readonly value: string) {}
    }
    @Injectable()
    class TestGender {
        constructor(@InjectRedisClient(_gender.provide as symbol) public readonly value: string) {}
    }
    @Injectable()
    class TestDefaultWithoutNamespaces {
        constructor(@InjectRedisClient() public readonly value: string) {}
    }
    @Injectable()
    class TestDefaultWithNamespaces {
        constructor(@InjectRedisClient(DEFAULT_REDIS_CLIENT) public readonly value: string) {}
    }

    let testName: TestName;
    let testGender: TestGender;
    let testDefaultWithoutNamespaces: TestDefaultWithoutNamespaces;
    let testDefaultWithNamespaces: TestDefaultWithNamespaces;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                _name,
                _gender,
                _default,
                TestName,
                TestGender,
                TestDefaultWithoutNamespaces,
                TestDefaultWithNamespaces
            ]
        }).compile();

        testName = moduleRef.get<TestName>(TestName);
        testGender = moduleRef.get<TestGender>(TestGender);
        testDefaultWithoutNamespaces = moduleRef.get<TestDefaultWithoutNamespaces>(TestDefaultWithoutNamespaces);
        testDefaultWithNamespaces = moduleRef.get<TestDefaultWithNamespaces>(TestDefaultWithNamespaces);
    });

    test('should inject provider name properly with namespaces', () => {
        expect(testName.value).toBe(_name.useValue);
    });

    test('should inject provider gender properly with namespaces', () => {
        expect(testGender.value).toBe(_gender.useValue);
    });

    test('should inject provider default properly without namespaces', () => {
        expect(testDefaultWithoutNamespaces.value).toBe(_default.useValue);
    });

    test('should inject provider default properly with namespaces', () => {
        expect(testDefaultWithNamespaces.value).toBe(_default.useValue);
    });

    test('should have 4 members in array namespaces', () => {
        expect(namespaces).toHaveLength(4);
        expect(namespaces).toContain(_name.provide);
        expect(namespaces).toContain(_gender.provide);
        expect(namespaces).toContain(_default.provide);
    });
});
