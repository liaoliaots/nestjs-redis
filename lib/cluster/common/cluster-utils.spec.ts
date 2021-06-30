import IORedis, { Cluster } from 'ioredis';
import { createClient, quitClients } from '.';
import { testConfig } from '../../../jest-env';
import { ClusterClients } from '../interfaces';

describe(`${createClient.name}`, () => {
    let client: Cluster;

    afterEach(async () => {
        await client.quit();
    });

    test('should create clients with options', async () => {
        client = createClient({
            nodes: [{ host: testConfig.cluster1.host, port: testConfig.cluster1.port }],
            options: { redisOptions: { password: testConfig.cluster1.password } }
        });

        await expect(client.ping()).resolves.toBeDefined();
    });

    test('should call onClientCreated', () => {
        const mockCreated = jest.fn((client: Cluster) => client);

        client = createClient({
            nodes: [{ host: testConfig.cluster1.host, port: testConfig.cluster1.port }],
            options: { redisOptions: { password: testConfig.cluster1.password } },
            onClientCreated: mockCreated
        });

        expect(mockCreated.mock.calls).toHaveLength(1);
        expect(mockCreated.mock.results[0].value).toBeInstanceOf(IORedis.Cluster);
    });
});

describe(`${quitClients.name}`, () => {
    const clients: ClusterClients = new Map();

    const timeout = () => {
        return new Promise<void>(resolve => {
            const id = setTimeout(() => {
                clearTimeout(id);
                resolve();
            }, 200);
        });
    };

    beforeAll(async () => {
        clients.set(
            'client0',
            new IORedis.Cluster([{ host: testConfig.cluster1.host, port: testConfig.cluster1.port }], {
                redisOptions: {
                    password: testConfig.cluster1.password
                }
            })
        );
        clients.set(
            'client1',
            new IORedis.Cluster([{ host: testConfig.cluster4.host, port: testConfig.cluster4.port }], {
                redisOptions: {
                    password: testConfig.cluster4.password
                }
            })
        );

        await timeout();
    });

    test('the state should be ready', () => {
        clients.forEach(client => expect(client.status).toBe('ready'));
    });

    test('the state should be end', async () => {
        quitClients(clients);

        await timeout();

        clients.forEach(client => expect(client.status).toBe('end'));
    });
});
