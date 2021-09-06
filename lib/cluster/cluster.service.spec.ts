import { Test, TestingModule } from '@nestjs/testing';
import IORedis from 'ioredis';
import { ClusterService } from './cluster.service';
import { ClusterClients } from './interfaces';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER_NAMESPACE } from './cluster.constants';

jest.mock('ioredis');

describe('ClusterService', () => {
    let clients: ClusterClients;
    let service: ClusterService;

    beforeEach(async () => {
        clients = new Map();
        clients.set(DEFAULT_CLUSTER_NAMESPACE, new IORedis.Cluster([]));
        clients.set('client1', new IORedis.Cluster([]));

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: CLUSTER_CLIENTS, useValue: clients }, ClusterService]
        }).compile();

        service = module.get<ClusterService>(ClusterService);
    });

    test('should have 2 members', () => {
        expect(service.clients.size).toBe(2);
    });

    test('should get a client with namespace', () => {
        const client = service.getClient('client1');
        expect(client).toBeInstanceOf(IORedis.Cluster);
    });

    test('should get default client with namespace', () => {
        const client = service.getClient(DEFAULT_CLUSTER_NAMESPACE);
        expect(client).toBeInstanceOf(IORedis.Cluster);
    });

    test('should get default client without namespace', () => {
        const client = service.getClient();
        expect(client).toBeInstanceOf(IORedis.Cluster);
    });

    test('should throw an error when getting a client with an unknown namespace', () => {
        expect(() => service.getClient('')).toThrow();
    });
});
