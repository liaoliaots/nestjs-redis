import { Test } from '@nestjs/testing';
import IORedis from 'ioredis';
import { ClusterService } from './cluster.service';
import { ClusterClients } from './interfaces';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER_CLIENT } from './cluster.constants';
import { quitClients } from './common';
import { testConfig } from '../../jest-env';

describe(`${ClusterService.name}`, () => {
    const clients: ClusterClients = new Map();

    let clusterService: ClusterService;

    afterAll(() => {
        quitClients(clients);
    });

    beforeAll(async () => {
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
            DEFAULT_CLUSTER_CLIENT,
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
            providers: [{ provide: CLUSTER_CLIENTS, useValue: clients }, ClusterService]
        }).compile();

        clusterService = moduleRef.get<ClusterService>(ClusterService);
    });

    test('the size of property clients should be equal to clients.size', () => {
        expect(clusterService.clients.size).toBe(clients.size);
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

    test('should get default client without namespace', async () => {
        const client = clusterService.getClient();

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should throw an error while getting client with an unknown namespace', () => {
        expect(() => clusterService.getClient('')).toThrow();
    });
});
