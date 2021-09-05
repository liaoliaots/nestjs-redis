import IORedis, { Cluster, ClusterNode, ClusterOptions } from 'ioredis';
import { createClient, quitClients } from './cluster.utils';
import { ClusterClients } from '../interfaces';

jest.mock('ioredis');
const MockCluster = IORedis.Cluster as jest.MockedClass<typeof IORedis.Cluster>;

const nodes: ClusterNode[] = [{ host: '127.0.0.1', port: 16380 }];

beforeEach(() => {
    MockCluster.mockReset();
});

describe('createClient', () => {
    test('should create a client with options', () => {
        const options: ClusterOptions = { redisOptions: { password: 'clusterpassword1' } };
        const client = createClient({ nodes, options });
        expect(MockCluster).toHaveBeenCalledTimes(1);
        expect(MockCluster).toHaveBeenCalledWith(nodes, options);
        expect(client).toBeInstanceOf(IORedis.Cluster);
    });

    test('should call onClientCreated', () => {
        const mockOnClientCreated = jest.fn();

        const client = createClient({ nodes, onClientCreated: mockOnClientCreated });
        expect(MockCluster).toHaveBeenCalledTimes(1);
        expect(MockCluster).toHaveBeenCalledWith(nodes, undefined);
        expect(client).toBeInstanceOf(IORedis.Cluster);
        expect(mockOnClientCreated).toHaveBeenCalledTimes(1);
        expect(mockOnClientCreated).toHaveBeenCalledWith(client);
    });
});

describe('quitClients', () => {
    let client1: Cluster;
    let client2: Cluster;
    let clients: ClusterClients;

    beforeEach(() => {
        client1 = new IORedis.Cluster(nodes);
        client2 = new IORedis.Cluster(nodes);
        clients = new Map();
        clients.set('client1', client1);
        clients.set('client2', client2);
    });

    test('when the status is ready', () => {
        Reflect.defineProperty(client1, 'status', { value: 'ready' });
        Reflect.defineProperty(client2, 'status', { value: 'ready' });

        const mockClient1Quit = jest.spyOn(client1, 'quit').mockRejectedValue(new Error('a redis error'));
        const mockClient2Quit = jest.spyOn(client2, 'quit').mockRejectedValue('');

        quitClients(clients);
        expect(mockClient1Quit).toHaveBeenCalledTimes(1);
        expect(mockClient2Quit).toHaveBeenCalledTimes(1);
    });

    test('when the status is ready and end', () => {
        Reflect.defineProperty(client1, 'status', { value: 'ready' });
        Reflect.defineProperty(client2, 'status', { value: 'end' });

        const mockClient1Quit = jest.spyOn(client1, 'quit').mockResolvedValue('OK');
        const mockClient2Disconnect = jest.spyOn(client2, 'disconnect');

        quitClients(clients);
        expect(mockClient1Quit).toHaveBeenCalledTimes(1);
        expect(mockClient2Disconnect).toHaveBeenCalledTimes(1);
    });
});
