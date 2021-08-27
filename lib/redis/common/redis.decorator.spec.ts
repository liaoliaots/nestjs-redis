import { Injectable, ValueProvider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRedis, namespaces } from './redis.decorator';
import { DEFAULT_REDIS_NAMESPACE } from '../redis.constants';

describe('InjectRedis', () => {
    const name: ValueProvider<string> = { provide: 'name', useValue: 'liaoliao' };
    const gender: ValueProvider<string> = { provide: Symbol('gender'), useValue: 'female' };
    const age: ValueProvider<string> = { provide: DEFAULT_REDIS_NAMESPACE, useValue: '26' };

    @Injectable()
    class TestName {
        constructor(@InjectRedis(name.provide as string) public readonly value: string) {}
    }
    @Injectable()
    class TestGender {
        constructor(@InjectRedis(gender.provide as symbol) public readonly value: string) {}
    }
    @Injectable()
    class TestAge {
        constructor(
            @InjectRedis(age.provide as symbol) public readonly value1: string,
            @InjectRedis() public readonly value2: string
        ) {}
    }

    let testName: TestName;
    let testGender: TestGender;
    let testAge: TestAge;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [name, gender, age, TestName, TestGender, TestAge]
        }).compile();

        testName = moduleRef.get<TestName>(TestName);
        testGender = moduleRef.get<TestGender>(TestGender);
        testAge = moduleRef.get<TestAge>(TestAge);
    });

    test('should work correctly', () => {
        expect(testName.value).toBe(name.useValue);
        expect(testGender.value).toBe(gender.useValue);
        expect(testAge.value1).toBe(age.useValue);
        expect(testAge.value2).toBe(age.useValue);
    });

    test('should have 4 members in array namespaces', () => {
        expect(namespaces).toHaveLength(3);
        expect(namespaces).toContain(name.provide);
        expect(namespaces).toContain(gender.provide);
        expect(namespaces).toContain(age.provide);
    });
});
