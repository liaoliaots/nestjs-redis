import { Test } from '@nestjs/testing';
import IORedis from 'ioredis';
import { ClusterService } from './cluster.service';
import { ClusterClients } from './interfaces';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER_CLIENT } from './cluster.constants';
import { quitClients } from './common';
import { testConfig } from '../../test/env';

describe(`${ClusterService.name}`, () => {
    const clients: ClusterClients = new Map();

    let clusterService: ClusterService;

    afterAll(() => {
        quitClients(clients);
    });

    beforeAll(async () => {
        clients.set(
            'client0',
            new IORedis.Cluster([{ host: testConfig.cluster1.host, port: testConfig.cluster1.port }], {
                redisOptions: { password: testConfig.cluster1.password }
            })
        );
        clients.set(
            DEFAULT_CLUSTER_CLIENT,
            new IORedis.Cluster([{ host: testConfig.cluster4.host, port: testConfig.cluster4.port }], {
                redisOptions: { password: testConfig.cluster4.password }
            })
        );

        const moduleRef = await Test.createTestingModule({
            providers: [{ provide: CLUSTER_CLIENTS, useValue: clients }, ClusterService]
        }).compile();

        clusterService = moduleRef.get<ClusterService>(ClusterService);
    });

    test('the size of property clients should be equal to clients.size', () => {
        expect(clusterService.clients.size).toBe(clients.size);
    });

    test('should get a client with namespace', async () => {
        const client = clusterService.getClient('client0');

        await expect(client.ping()).resolves.toBeDefined();
    });

    test('should get default client with namespace', async () => {
        const client = clusterService.getClient(DEFAULT_CLUSTER_CLIENT);

        await expect(client.ping()).resolves.toBeDefined();
    });

    test('should get default client without namespace', async () => {
        const client = clusterService.getClient();

        await expect(client.ping()).resolves.toBeDefined();
    });

    test('should throw an error when getting a client with an unknown namespace', () => {
        expect(() => clusterService.getClient('')).toThrow();
    });
});
