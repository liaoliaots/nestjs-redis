import { Logger } from '@nestjs/common';
import IORedis, { Cluster } from 'ioredis';
import { createClient, quitClients, logger, displayReadyLog } from './cluster.utils';
import { ClusterClients, ClusterClientOptions } from '../interfaces';

jest.mock('ioredis');
const MockCluster = IORedis.Cluster as jest.MockedClass<typeof IORedis.Cluster>;

beforeEach(() => {
    MockCluster.mockReset();
});

describe('logger', () => {
    test('should be an instance of Logger', () => {
        expect(logger).toBeInstanceOf(Logger);
    });
});

describe('displayReadyLog', () => {
    let client: Cluster;
    let clients: ClusterClients;

    beforeEach(() => {
        client = new IORedis.Cluster([]);
        clients = new Map();
        clients.set('client', client);
    });

    test('should work correctly', () => {
        const mockOnce = jest
            .spyOn(client, 'once')
            .mockImplementation((event: string | symbol, listener: (...args: unknown[]) => void) => {
                listener();
                return undefined as unknown as Cluster;
            });

        displayReadyLog(clients);
        expect(mockOnce).toHaveBeenCalledTimes(1);
    });
});

describe('createClient', () => {
    test('should create a client with options', () => {
        const options: ClusterClientOptions = {
            nodes: [{ host: '127.0.0.1', port: 16380 }],
            options: { redisOptions: { password: '' } }
        };
        const client = createClient(options);
        expect(MockCluster).toHaveBeenCalledTimes(1);
        expect(MockCluster).toHaveBeenCalledWith(options.nodes, options.options);
        expect(client).toBeInstanceOf(IORedis.Cluster);
    });

    test('should call onClientCreated', () => {
        const mockOnClientCreated = jest.fn();

        const client = createClient({ nodes: [], onClientCreated: mockOnClientCreated });
        expect(MockCluster).toHaveBeenCalledTimes(1);
        expect(MockCluster).toHaveBeenCalledWith([], undefined);
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
        client1 = new IORedis.Cluster([]);
        client2 = new IORedis.Cluster([]);
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
