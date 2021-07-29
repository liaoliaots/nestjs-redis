import { Injectable, ValueProvider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRedis, namespaces } from '.';
import { DEFAULT_REDIS_NAMESPACE } from '../redis.constants';

describe(`${InjectRedis.name}`, () => {
    const _name: ValueProvider<string> = { provide: 'name', useValue: 'liaoliao' };
    const _gender: ValueProvider<string> = { provide: Symbol('gender'), useValue: 'cute' };
    const _default: ValueProvider<string> = { provide: DEFAULT_REDIS_NAMESPACE, useValue: 'default' };

    @Injectable()
    class TestName {
        constructor(@InjectRedis(_name.provide as string) public readonly value: string) {}
    }
    @Injectable()
    class TestGender {
        constructor(@InjectRedis(_gender.provide as symbol) public readonly value: string) {}
    }
    @Injectable()
    class TestDefaultWithoutNamespace {
        constructor(@InjectRedis() public readonly value: string) {}
    }
    @Injectable()
    class TestDefaultWithNamespace {
        constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) public readonly value: string) {}
    }

    let testName: TestName;
    let testGender: TestGender;
    let testDefaultWithoutNamespace: TestDefaultWithoutNamespace;
    let testDefaultWithNamespace: TestDefaultWithNamespace;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                _name,
                _gender,
                _default,
                TestName,
                TestGender,
                TestDefaultWithoutNamespace,
                TestDefaultWithNamespace
            ]
        }).compile();

        testName = moduleRef.get<TestName>(TestName);
        testGender = moduleRef.get<TestGender>(TestGender);
        testDefaultWithoutNamespace = moduleRef.get<TestDefaultWithoutNamespace>(TestDefaultWithoutNamespace);
        testDefaultWithNamespace = moduleRef.get<TestDefaultWithNamespace>(TestDefaultWithNamespace);
    });

    test('should inject provider name with namespace', () => {
        expect(testName.value).toBe(_name.useValue);
    });

    test('should inject provider gender with namespace', () => {
        expect(testGender.value).toBe(_gender.useValue);
    });

    test('should inject provider default without namespace', () => {
        expect(testDefaultWithoutNamespace.value).toBe(_default.useValue);
    });

    test('should inject provider default with namespace', () => {
        expect(testDefaultWithNamespace.value).toBe(_default.useValue);
    });

    test('should have 4 members in array namespaces', () => {
        expect(namespaces).toHaveLength(4);
        expect(namespaces).toContain(_name.provide);
        expect(namespaces).toContain(_gender.provide);
        expect(namespaces).toContain(_default.provide);
    });
});
