import { Injectable, ValueProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectCluster, namespaces, getClusterToken } from './cluster.decorator';
import { DEFAULT_CLUSTER_NAMESPACE, CLUSTER_MODULE_ID } from '../cluster.constants';
import { ClientNamespace } from '@/interfaces';

describe('namespaces', () => {
    test('should be an instance of the map', () => {
        expect(namespaces).toBeInstanceOf(Map);
    });
});

describe('getClusterToken', () => {
    test('should work correctly', () => {
        const namespace1 = Symbol('default-client');
        const namespace2 = 'cache-client';
        expect(getClusterToken(namespace1)).toBe(namespace1);
        expect(getClusterToken(namespace2)).toBe(`${CLUSTER_MODULE_ID}:${namespace2}`);
    });
});

describe('InjectCluster', () => {
    const nameNamespace: ClientNamespace = 'name';
    const genderNamespace: ClientNamespace = DEFAULT_CLUSTER_NAMESPACE;
    const name: ValueProvider<string> = { provide: getClusterToken(nameNamespace), useValue: 'liaoliao' };
    const gender: ValueProvider<string> = { provide: getClusterToken(genderNamespace), useValue: 'female' };

    @Injectable()
    class TestName {
        constructor(
            @InjectCluster(nameNamespace) public readonly value1: string,
            @InjectCluster(nameNamespace) public readonly value2: string
        ) {}
    }
    @Injectable()
    class TestGender {
        constructor(
            @InjectCluster(genderNamespace) public readonly value1: string,
            @InjectCluster() public readonly value2: string
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
