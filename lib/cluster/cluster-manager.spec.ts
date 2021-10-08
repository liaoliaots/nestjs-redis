import { Test, TestingModule } from '@nestjs/testing';
import IORedis from 'ioredis';
import { ClusterManager } from './cluster-manager';
import { ClusterClients } from './interfaces';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER_NAMESPACE } from './cluster.constants';

describe('ClusterManager', () => {
    let clients: ClusterClients;
    let manager: ClusterManager;

    beforeEach(async () => {
        clients = new Map();
        clients.set(DEFAULT_CLUSTER_NAMESPACE, new IORedis.Cluster([]));
        clients.set('client1', new IORedis.Cluster([]));

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: CLUSTER_CLIENTS, useValue: clients }, ClusterManager]
        }).compile();

        manager = module.get<ClusterManager>(ClusterManager);
    });

    test('should have 2 members', () => {
        expect(manager.clients.size).toBe(2);
    });

    test('should get a client with namespace', () => {
        const client = manager.getClient('client1');
        expect(client).toBeInstanceOf(IORedis.Cluster);
    });

    test('should get default client with namespace', () => {
        const client = manager.getClient(DEFAULT_CLUSTER_NAMESPACE);
        expect(client).toBeInstanceOf(IORedis.Cluster);
    });

    test('should get default client without namespace', () => {
        const client = manager.getClient();
        expect(client).toBeInstanceOf(IORedis.Cluster);
    });

    test('should throw an error when getting a client with an unknown namespace', () => {
        expect(() => manager.getClient('')).toThrow();
    });
});
