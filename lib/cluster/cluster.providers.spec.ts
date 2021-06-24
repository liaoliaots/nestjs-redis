import { Test } from '@nestjs/testing';
import IORedis, { Cluster } from 'ioredis';
import {
    createProviders,
    createAsyncProviders,
    createAsyncOptionsProvider,
    clusterClientsProvider,
    createClusterClientProviders
} from './cluster.providers';
import { ClusterOptionsFactory, ClusterModuleAsyncOptions, ClusterClients, ClusterModuleOptions } from './interfaces';
import { CLUSTER_OPTIONS, CLUSTER_CLIENTS, DEFAULT_CLUSTER_CLIENT } from './cluster.constants';
import { namespaces, quitClients } from './common';
import { ClusterService } from './cluster.service';
import { testConfig } from '../../jest-env';

class ClusterConfigService implements ClusterOptionsFactory {
    createClusterOptions(): ClusterModuleOptions {
        return {
            config: {
                startupNodes: []
            }
        };
    }
}

const clusterModuleOptions: ClusterModuleOptions = { config: { startupNodes: [] } };

describe(`${createProviders.name}`, () => {
    test('should have 2 members in the result array', () => {
        expect(createProviders(clusterModuleOptions)).toHaveLength(2);
    });
});

describe(`${createAsyncProviders.name}`, () => {
    test('if provide useFactory or useExisting, the result array should have 2 members', () => {
        expect(createAsyncProviders({ useFactory: () => clusterModuleOptions, inject: [] })).toHaveLength(2);
        expect(createAsyncProviders({ useExisting: ClusterConfigService })).toHaveLength(2);
    });

    test('if provide useClass, the result array should have 3 members', () => {
        expect(createAsyncProviders({ useClass: ClusterConfigService })).toHaveLength(3);
    });

    test('should throw an error without options', () => {
        expect(() => createAsyncProviders({})).toThrow();
    });
});

describe(`${createAsyncOptionsProvider.name}`, () => {
    test('should create provider with useFactory', () => {
        const options: ClusterModuleAsyncOptions = { useFactory: () => clusterModuleOptions, inject: ['DIToken'] };

        expect(createAsyncOptionsProvider(options)).toEqual({ provide: CLUSTER_OPTIONS, ...options });
    });

    test('should create provider with useClass', () => {
        const options: ClusterModuleAsyncOptions = { useClass: ClusterConfigService };

        expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', CLUSTER_OPTIONS);
        expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
        expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [ClusterConfigService]);
    });

    test('should create provider with useExisting', () => {
        const options: ClusterModuleAsyncOptions = { useExisting: ClusterConfigService };

        expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', CLUSTER_OPTIONS);
        expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
        expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [ClusterConfigService]);
    });

    test('should create provider without options', () => {
        expect(createAsyncOptionsProvider({})).toEqual({ provide: CLUSTER_OPTIONS, useValue: {} });
    });
});

describe('clusterClientsProvider', () => {
    describe('with multiple clients', () => {
        let clients: ClusterClients;

        let clusterService: ClusterService;

        afterAll(() => {
            quitClients(clients);
        });

        beforeAll(async () => {
            const options: ClusterModuleOptions = {
                config: [
                    {
                        namespace: 'client0',
                        startupNodes: [
                            { host: testConfig.cluster1.host, port: testConfig.cluster1.port },
                            { host: testConfig.cluster2.host, port: testConfig.cluster2.port },
                            { host: testConfig.cluster3.host, port: testConfig.cluster3.port }
                        ],
                        clusterOptions: {
                            redisOptions: {
                                password: testConfig.cluster1.password
                            }
                        }
                    },
                    {
                        startupNodes: [
                            { host: testConfig.cluster4.host, port: testConfig.cluster4.port },
                            { host: testConfig.cluster5.host, port: testConfig.cluster5.port },
                            { host: testConfig.cluster6.host, port: testConfig.cluster6.port }
                        ],
                        clusterOptions: {
                            redisOptions: {
                                password: testConfig.cluster4.password
                            }
                        }
                    }
                ]
            };

            const moduleRef = await Test.createTestingModule({
                providers: [{ provide: CLUSTER_OPTIONS, useValue: options }, clusterClientsProvider, ClusterService]
            }).compile();

            clients = moduleRef.get<ClusterClients>(CLUSTER_CLIENTS);
            clusterService = moduleRef.get<ClusterService>(ClusterService);
        });

        test('should have 2 members', () => {
            expect(clients.size).toBe(2);
        });

        test('should get client with namespace', async () => {
            const client = clusterService.getClient('client0');

            const res = await client.ping();

            expect(res).toBe('PONG');
        });

        test('should get default client with namespace', async () => {
            const client = clusterService.getClient(DEFAULT_CLUSTER_CLIENT);

            const res = await client.ping();

            expect(res).toBe('PONG');
        });
    });

    describe('with single client', () => {
        let clients: ClusterClients;

        let clusterService: ClusterService;

        afterAll(() => {
            quitClients(clients);
        });

        beforeAll(async () => {
            const options: ClusterModuleOptions = {
                config: {
                    startupNodes: [
                        { host: testConfig.cluster1.host, port: testConfig.cluster1.port },
                        { host: testConfig.cluster2.host, port: testConfig.cluster2.port },
                        { host: testConfig.cluster3.host, port: testConfig.cluster3.port }
                    ],
                    clusterOptions: {
                        redisOptions: {
                            password: testConfig.cluster1.password
                        }
                    }
                }
            };

            const moduleRef = await Test.createTestingModule({
                providers: [{ provide: CLUSTER_OPTIONS, useValue: options }, clusterClientsProvider, ClusterService]
            }).compile();

            clients = moduleRef.get<ClusterClients>(CLUSTER_CLIENTS);
            clusterService = moduleRef.get<ClusterService>(ClusterService);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should get default client with namespace', async () => {
            const client = clusterService.getClient(DEFAULT_CLUSTER_CLIENT);

            const res = await client.ping();

            expect(res).toBe('PONG');
        });
    });
});

describe(`${createClusterClientProviders.name}`, () => {
    const clients: ClusterClients = new Map();

    let client0: Cluster;
    let client1: Cluster;

    afterAll(() => {
        quitClients(clients);
    });

    beforeAll(async () => {
        namespaces.push(...['client0', 'client1']);

        clients.set(
            'client0',
            new IORedis.Cluster(
                [
                    { host: testConfig.cluster1.host, port: testConfig.cluster1.port },
                    { host: testConfig.cluster2.host, port: testConfig.cluster2.port },
                    { host: testConfig.cluster3.host, port: testConfig.cluster3.port }
                ],
                {
                    redisOptions: {
                        password: testConfig.cluster1.password
                    }
                }
            )
        );
        clients.set(
            'client1',
            new IORedis.Cluster(
                [
                    { host: testConfig.cluster4.host, port: testConfig.cluster4.port },
                    { host: testConfig.cluster5.host, port: testConfig.cluster5.port },
                    { host: testConfig.cluster6.host, port: testConfig.cluster6.port }
                ],
                {
                    redisOptions: {
                        password: testConfig.cluster4.password
                    }
                }
            )
        );

        const moduleRef = await Test.createTestingModule({
            providers: [
                { provide: CLUSTER_CLIENTS, useValue: clients },
                ClusterService,
                ...createClusterClientProviders()
            ]
        }).compile();

        client0 = moduleRef.get<Cluster>('client0');
        client1 = moduleRef.get<Cluster>('client1');
    });

    test('client0 should work correctly', async () => {
        const res = await client0.ping();

        expect(res).toBe('PONG');
    });

    test('client1 should work correctly', async () => {
        const res = await client1.ping();

        expect(res).toBe('PONG');
    });
});
