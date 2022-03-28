import { Cluster } from 'ioredis';
import { createClient, quitClients, displayReadyLog, displayErrorLog } from './cluster.utils';
import { ClusterClients, ClusterClientOptions } from '../interfaces';

jest.mock('../cluster-logger', () => ({
    logger: {
        log: jest.fn(),
        error: jest.fn()
    }
}));

const mockOn = jest.fn();
const mockQuit = jest.fn();
const mockDisconnect = jest.fn();
jest.mock('ioredis', () => ({
    Cluster: jest.fn(() => ({
        on: mockOn,
        quit: mockQuit,
        disconnect: mockDisconnect
    }))
}));

beforeEach(() => {
    mockOn.mockReset();
    mockQuit.mockReset();
    mockDisconnect.mockReset();
});

describe('createClient', () => {
    const MockCluster = Cluster as jest.MockedClass<typeof Cluster>;
    beforeEach(() => {
        MockCluster.mockClear();
    });

    test('should create a client with options', () => {
        const options: ClusterClientOptions = {
            nodes: [{ host: '127.0.0.1', port: 16380 }],
            redisOptions: { password: '' }
        };
        const client = createClient(options);
        expect(client).toBeDefined();
        expect(MockCluster).toHaveBeenCalledTimes(1);
        expect(MockCluster).toHaveBeenCalledWith(options.nodes, { redisOptions: { password: '' } });
        expect(MockCluster.mock.instances).toHaveLength(1);
    });

    test('should call onClientCreated', () => {
        const mockOnClientCreated = jest.fn();

        const client = createClient({ nodes: [], onClientCreated: mockOnClientCreated });
        expect(client).toBeDefined();
        expect(MockCluster).toHaveBeenCalledTimes(1);
        expect(MockCluster).toHaveBeenCalledWith([], {});
        expect(MockCluster.mock.instances).toHaveLength(1);
        expect(mockOnClientCreated).toHaveBeenCalledTimes(1);
        expect(mockOnClientCreated).toHaveBeenCalledWith(client);
    });
});

describe('displayReadyLog', () => {
    let client: Cluster;
    let clients: ClusterClients;

    beforeEach(() => {
        client = new Cluster([]);
        clients = new Map();
        clients.set('client', client);
    });

    test('should work correctly', () => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        mockOn.mockImplementation((_, fn: Function) => {
            fn();
        });
        displayReadyLog(clients);
        expect(mockOn).toHaveBeenCalledTimes(1);
    });
});

describe('displayErrorLog', () => {
    let client: Cluster;
    let clients: ClusterClients;

    beforeEach(() => {
        client = new Cluster([]);
        clients = new Map();
        clients.set('client', client);
    });

    test('should work correctly', () => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        mockOn.mockImplementation((_, fn: Function) => {
            fn({ message: '' });
        });
        displayErrorLog(clients);
        expect(mockOn).toHaveBeenCalledTimes(1);
    });
});

describe('quitClients', () => {
    let client1: Cluster;
    let client2: Cluster;
    let clients: ClusterClients;

    beforeEach(() => {
        client1 = new Cluster([]);
        client2 = new Cluster([]);
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
        expect(mockClient1Quit).toHaveBeenCalled();
        expect(mockClient2Quit).toHaveBeenCalled();
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
        expect(mockClient1Quit).toHaveBeenCalled();
        expect(mockClient2Disconnect).toHaveBeenCalled();
        expect(results).toHaveLength(1);
    });
});
