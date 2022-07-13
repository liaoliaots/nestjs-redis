import { FactoryProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cluster } from 'ioredis';
import {
  createOptionsProvider,
  createAsyncProviders,
  createAsyncOptionsProvider,
  clusterClientsProvider,
  createClusterClientProviders,
  createAsyncOptions
} from './cluster.providers';
import { ClusterOptionsFactory, ClusterModuleAsyncOptions, ClusterClients, ClusterModuleOptions } from './interfaces';
import { CLUSTER_OPTIONS, CLUSTER_CLIENTS, CLUSTER_INTERNAL_OPTIONS } from './cluster.constants';
import { namespaces } from './common';
import { ClusterManager } from './cluster-manager';
import { defaultClusterModuleOptions } from './default-options';

jest.mock('ioredis', () => ({
  Cluster: jest.fn(() => ({}))
}));

const clusterOptions: ClusterModuleOptions = { config: { nodes: [] } };
class ClusterConfigService implements ClusterOptionsFactory {
  createClusterOptions(): ClusterModuleOptions {
    return clusterOptions;
  }
}

describe('createOptionsProvider', () => {
  test('should work correctly', () => {
    expect(createOptionsProvider(clusterOptions)).toEqual({
      provide: CLUSTER_OPTIONS,
      useValue: { ...defaultClusterModuleOptions, ...clusterOptions }
    });
  });
});

describe('createAsyncProviders', () => {
  test('should create providers with useFactory', () => {
    const result = createAsyncProviders({ useFactory: () => clusterOptions, inject: [] });
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('provide', CLUSTER_OPTIONS);
    expect(result[0]).toHaveProperty('inject', [CLUSTER_INTERNAL_OPTIONS]);
    expect((result[0] as FactoryProvider).useFactory({ closeClient: true })).toEqual({
      ...defaultClusterModuleOptions,
      closeClient: true
    });
    expect(result[1]).toHaveProperty('provide', CLUSTER_INTERNAL_OPTIONS);
    expect(result[1]).toHaveProperty('inject', []);
  });

  test('should create providers with useClass', () => {
    const result = createAsyncProviders({ useClass: ClusterConfigService });
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('provide', ClusterConfigService);
    expect(result[0]).toHaveProperty('useClass', ClusterConfigService);
    expect(result[1]).toHaveProperty('provide', CLUSTER_OPTIONS);
    expect(result[1]).toHaveProperty('inject', [ClusterConfigService]);
  });

  test('should create providers with useExisting', () => {
    const result = createAsyncProviders({ useExisting: ClusterConfigService });
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('provide', CLUSTER_OPTIONS);
    expect(result[0]).toHaveProperty('inject', [ClusterConfigService]);
  });

  test('should create providers without options', () => {
    const result = createAsyncProviders({});
    expect(result).toHaveLength(0);
  });
});

describe('createAsyncOptions', () => {
  test('should work correctly', async () => {
    const clusterConfigService: ClusterOptionsFactory = {
      createClusterOptions() {
        return { config: { nodes: [] } };
      }
    };
    await expect(createAsyncOptions(clusterConfigService)).resolves.toEqual({
      ...defaultClusterModuleOptions,
      config: { nodes: [] }
    });
  });
});

describe('createAsyncOptionsProvider', () => {
  test('should create provider with useFactory', () => {
    const options: ClusterModuleAsyncOptions = { useFactory: () => clusterOptions, inject: ['token'] };
    expect(createAsyncOptionsProvider(options)).toEqual({ provide: CLUSTER_INTERNAL_OPTIONS, ...options });
  });

  test('should create provider with useClass', () => {
    const options: ClusterModuleAsyncOptions = { useClass: ClusterConfigService };
    expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', CLUSTER_OPTIONS);
    expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
    expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [ClusterConfigService]);
  });

  test('should create provider with useExisting', () => {
    const options: ClusterModuleAsyncOptions = { useExisting: ClusterConfigService };
    expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', CLUSTER_OPTIONS);
    expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
    expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [ClusterConfigService]);
  });

  test('should create provider without options', () => {
    expect(createAsyncOptionsProvider({})).toEqual({ provide: CLUSTER_OPTIONS, useValue: {} });
  });
});

describe('clusterClientsProvider', () => {
  test('should be a dynamic module', () => {
    expect(clusterClientsProvider).toHaveProperty('provide', CLUSTER_CLIENTS);
    expect(clusterClientsProvider).toHaveProperty('useFactory');
    expect(clusterClientsProvider).toHaveProperty('inject', [CLUSTER_OPTIONS]);
  });

  test('with multiple clients', async () => {
    const options: ClusterModuleOptions = {
      config: [{ nodes: [] }, { namespace: 'client1', nodes: [] }]
    };
    const clients = await clusterClientsProvider.useFactory(options);
    expect(clients.size).toBe(2);
  });

  describe('with single client', () => {
    test('with namespace', async () => {
      const options: ClusterModuleOptions = { config: { namespace: 'client1', nodes: [] } };
      const clients = await clusterClientsProvider.useFactory(options);
      expect(clients.size).toBe(1);
    });

    test('without namespace', async () => {
      const options: ClusterModuleOptions = { config: { nodes: [] } };
      const clients = await clusterClientsProvider.useFactory(options);
      expect(clients.size).toBe(1);
    });
  });
});

describe('createClusterClientProviders', () => {
  let clients: ClusterClients;
  let client1: Cluster;
  let client2: Cluster;

  beforeEach(async () => {
    clients = new Map();
    clients.set('client1', new Cluster([]));
    clients.set('client2', new Cluster([]));
    namespaces.set('client1', 'client1');
    namespaces.set('client2', 'client2');

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CLUSTER_CLIENTS, useValue: clients }, ClusterManager, ...createClusterClientProviders()]
    }).compile();

    client1 = module.get<Cluster>('client1');
    client2 = module.get<Cluster>('client2');
  });

  afterEach(() => {
    namespaces.clear();
  });

  test('should work correctly', () => {
    expect(client1).toBeDefined();
    expect(client2).toBeDefined();
  });
});
