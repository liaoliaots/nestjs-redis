import IORedis, { Cluster } from 'ioredis';
import { createClient, quitClients } from '.';
import { testConfig } from '../../../jest-env';
import { ClusterClients } from '../interfaces';

describe(`${createClient.name}`, () => {
    let client: Cluster;

    afterEach(async () => {
        await client.quit();
    });

    test('should create client with options', async () => {
        client = createClient({
            startupNodes: [
                { host: testConfig.cluster1.host, port: testConfig.cluster1.port },
                { host: testConfig.cluster2.host, port: testConfig.cluster2.port },
                { host: testConfig.cluster3.host, port: testConfig.cluster3.port }
            ],
            clusterOptions: {
                redisOptions: {
                    password: testConfig.cluster1.password
                }
            }
        });

        const res = await client.ping();

        expect(res).toBe('PONG');
    });

    test('should call onClientCreated', () => {
        const mockCreated = jest.fn((client: Cluster) => client);

        client = createClient({
            startupNodes: [
                { host: testConfig.cluster1.host, port: testConfig.cluster1.port },
                { host: testConfig.cluster2.host, port: testConfig.cluster2.port },
                { host: testConfig.cluster3.host, port: testConfig.cluster3.port }
            ],
            clusterOptions: {
                redisOptions: {
                    password: testConfig.cluster1.password
                }
            },
            onClientCreated: mockCreated
        });

        expect(mockCreated.mock.calls).toHaveLength(1);
        expect(mockCreated.mock.results[0].value).toBeInstanceOf(IORedis.Cluster);
    });
});

describe(`${quitClients.name}`, () => {
    const clients: ClusterClients = new Map();

    const timeout = () =>
        new Promise(resolve => {
            const id = setTimeout(() => {
                clearTimeout(id);
                resolve(undefined);
            }, 100);
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
            'client1',
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
