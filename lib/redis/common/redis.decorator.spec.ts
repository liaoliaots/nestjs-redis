import { Injectable, ValueProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectRedis, namespaces, getRedisToken } from './redis.decorator';
import { DEFAULT_REDIS_NAMESPACE, REDIS_MODULE_ID } from '../redis.constants';
import { ClientNamespace } from '@/interfaces';

describe('namespaces', () => {
    test('should be an instance of the map', () => {
        expect(namespaces).toBeInstanceOf(Map);
    });
});

describe('getRedisToken', () => {
    test('should work correctly', () => {
        const namespace1 = Symbol('default-client');
        const namespace2 = 'cache-client';
        expect(getRedisToken(namespace1)).toBe(namespace1);
        expect(getRedisToken(namespace2)).toBe(`${REDIS_MODULE_ID}:${namespace2}`);
    });
});

describe('InjectRedis', () => {
    const nameNamespace: ClientNamespace = 'name';
    const genderNamespace: ClientNamespace = DEFAULT_REDIS_NAMESPACE;
    const name: ValueProvider<string> = { provide: getRedisToken(nameNamespace), useValue: 'liaoliao' };
    const gender: ValueProvider<string> = { provide: getRedisToken(genderNamespace), useValue: 'female' };

    @Injectable()
    class TestName {
        constructor(
            @InjectRedis(nameNamespace) public readonly value1: string,
            @InjectRedis(nameNamespace) public readonly value2: string
        ) {}
    }
    @Injectable()
    class TestGender {
        constructor(
            @InjectRedis(genderNamespace) public readonly value1: string,
            @InjectRedis() public readonly value2: string
        ) {}
    }

    let testName: TestName;
    let testGender: TestGender;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [name, gender, TestName, TestGender]
        }).compile();

        testName = module.get<TestName>(TestName);
        testGender = module.get<TestGender>(TestGender);
    });

    test('should work correctly', () => {
        expect(testName.value1).toBe(name.useValue);
        expect(testName.value2).toBe(name.useValue);
        expect(testGender.value1).toBe(gender.useValue);
        expect(testGender.value2).toBe(gender.useValue);
    });

    test('should have 2 members in namespaces map', () => {
        expect(namespaces.size).toBe(2);
        expect(namespaces.has(nameNamespace)).toBe(true);
        expect(namespaces.has(genderNamespace)).toBe(true);
    });
});
