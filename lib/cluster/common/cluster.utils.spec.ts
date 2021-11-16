import { Logger } from '@nestjs/common';
import IORedis, { Cluster } from 'ioredis';
import { createClient, quitClients, logger, displayReadyLog } from './cluster.utils';
import { ClusterClients, ClusterClientOptions } from '../interfaces';
import { CLUSTER_MODULE_ID } from '../cluster.constants';

jest.mock('@nestjs/common', () => ({
    __esModule: true,
    ...jest.requireActual('@nestjs/common'),
    Logger: jest.fn(() => ({
        log: jest.fn()
    }))
}));

const MockCluster = IORedis.Cluster as jest.MockedClass<typeof IORedis.Cluster>;

beforeEach(() => {
    MockCluster.mockReset();
    (logger.log as jest.Mock).mockReset();
});

describe('logger', () => {
    const MockLogger = Logger as jest.MockedClass<typeof Logger>;

    afterEach(() => {
        MockLogger.mockReset();
    });

    test('should be defined', () => {
        expect(logger).toBeDefined();
        expect(MockLogger).toHaveBeenCalledTimes(1);
        expect(MockLogger).toHaveBeenCalledWith(CLUSTER_MODULE_ID);
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
        const mockLog = jest.spyOn(logger, 'log');

        displayReadyLog(clients);
        expect(mockOnce).toHaveBeenCalledTimes(1);
        expect(mockLog).toHaveBeenCalledTimes(1);
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

    test('the status is ready', async () => {
        Reflect.defineProperty(client1, 'status', { value: 'ready' });
        Reflect.defineProperty(client2, 'status', { value: 'ready' });

        const mockClient1Quit = jest.spyOn(client1, 'quit').mockRejectedValue(new Error('a redis error'));
        const mockClient2Quit = jest.spyOn(client2, 'quit').mockRejectedValue('');

        const results = await quitClients(clients);
        expect(mockClient1Quit).toHaveBeenCalledTimes(1);
        expect(mockClient2Quit).toHaveBeenCalledTimes(1);
        expect(results).toHaveLength(2);
        expect(results[0][0]).toEqual({ status: 'fulfilled', value: 'client1' });
        expect(results[0][1]).toHaveProperty('status', 'rejected');
        expect(results[0][1]).toHaveProperty('reason');
        expect(results[1][0]).toEqual({ status: 'fulfilled', value: 'client2' });
        expect(results[1][1]).toEqual({ status: 'rejected', reason: '' });
    });

    test('the status is ready and end', async () => {
        Reflect.defineProperty(client1, 'status', { value: 'ready' });
        Reflect.defineProperty(client2, 'status', { value: 'end' });

        const mockClient1Quit = jest.spyOn(client1, 'quit').mockResolvedValue('OK');
        const mockClient2Disconnect = jest.spyOn(client2, 'disconnect');

        const results = await quitClients(clients);
        expect(mockClient1Quit).toHaveBeenCalledTimes(1);
        expect(mockClient2Disconnect).toHaveBeenCalledTimes(1);
        expect(results).toHaveLength(1);
    });
});
