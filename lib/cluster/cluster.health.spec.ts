import { Test } from '@nestjs/testing';
import IORedis from 'ioredis';
import { ClusterHealthIndicator } from './cluster.health';
import { CLUSTER_CLIENTS } from './cluster.constants';
import { ClusterService } from './cluster.service';
import { ClusterClients } from './interfaces';
import { quitClients } from './common';
import { testConfig } from '../../test/env';

describe(`${ClusterHealthIndicator.name}`, () => {
    const clients: ClusterClients = new Map();

    let clusterHealth: ClusterHealthIndicator;

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

        const moduleRef = await Test.createTestingModule({
            providers: [{ provide: CLUSTER_CLIENTS, useValue: clients }, ClusterService, ClusterHealthIndicator]
        }).compile();

        clusterHealth = moduleRef.get<ClusterHealthIndicator>(ClusterHealthIndicator);
    });

    test('should state up', () => {
        return expect(clusterHealth.isHealthy('cluster', { namespace: 'client0' })).resolves.toEqual({
            cluster: { status: 'up' }
        });
    });
});
