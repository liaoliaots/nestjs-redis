import { Test, TestingModule } from '@nestjs/testing';
import { Cluster } from 'ioredis';
import {
  createOptionsProvider,
  createAsyncProviders,
  createAsyncOptionsProvider,
  clusterClientsProvider,
  createClusterClientProviders,
  createAsyncOptions,
  mergedOptionsProvider
} from './cluster.providers';
import { ClusterOptionsFactory, ClusterModuleAsyncOptions, ClusterClients, ClusterModuleOptions } from './interfaces';
import { CLUSTER_OPTIONS, CLUSTER_CLIENTS, CLUSTER_MERGED_OPTIONS } from './cluster.constants';
import { namespaces } from './common';
import { ClusterManager } from './cluster-manager';
import { defaultClusterModuleOptions } from './default-options';

jest.mock('ioredis', () => ({
  Cluster: jest.fn(() => ({}))
}));

describe('createOptionsProvider', () => {
  test('should work correctly', () => {
    expect(createOptionsProvider({ config: { nodes: [] } })).toEqual({
      provide: CLUSTER_OPTIONS,
      useValue: { config: { nodes: [] } }
    });
  });
});

describe('createAsyncProviders', () => {
  class ClusterConfigService implements ClusterOptionsFactory {
    createClusterOptions(): ClusterModuleOptions {
      return { config: { nodes: [] } };
    }
  }

  test('with useFactory', () => {
    const result = createAsyncProviders({ useFactory: () => ({ config: { nodes: [] } }), inject: [] });
    expect(result).toHaveLength(1);
    expect(result).toPartiallyContain({ provide: CLUSTER_OPTIONS, inject: [] });
    expect(result[0]).toHaveProperty('useFactory');
  });

  test('with useClass', () => {
    const result = createAsyncProviders({ useClass: ClusterConfigService });
    expect(result).toHaveLength(2);
    expect(result).toIncludeAllPartialMembers([
      { provide: ClusterConfigService, useClass: ClusterConfigService },
      { provide: CLUSTER_OPTIONS, inject: [ClusterConfigService] }
    ]);
    expect(result[1]).toHaveProperty('useFactory');
  });

  test('with useExisting', () => {
    const result = createAsyncProviders({ useExisting: ClusterConfigService });
    expect(result).toHaveLength(1);
    expect(result).toIncludeAllPartialMembers([{ provide: CLUSTER_OPTIONS, inject: [ClusterConfigService] }]);
    expect(result[0]).toHaveProperty('useFactory');
  });

  test('without options', () => {
    const result = createAsyncProviders({});
    expect(result).toHaveLength(0);
  });
});

describe('createAsyncOptions', () => {
  test('should work correctly', async () => {
    const clusterConfigService: ClusterOptionsFactory = {
      createClusterOptions(): ClusterModuleOptions {
        return { closeClient: true, config: { nodes: [] } };
      }
    };
    await expect(createAsyncOptions(clusterConfigService)).resolves.toEqual({
      closeClient: true,
      config: { nodes: [] }
    });
  });
});

describe('createAsyncOptionsProvider', () => {
  class ClusterConfigService implements ClusterOptionsFactory {
    createClusterOptions(): ClusterModuleOptions {
      return { config: { nodes: [] } };
    }
  }

  test('with useFactory', () => {
    const options: ClusterModuleAsyncOptions = { useFactory: () => ({ config: { nodes: [] } }), inject: ['token'] };
    expect(createAsyncOptionsProvider(options)).toEqual({ provide: CLUSTER_OPTIONS, ...options });
  });

  test('with useClass', () => {
    const options: ClusterModuleAsyncOptions = { useClass: ClusterConfigService };
    expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', CLUSTER_OPTIONS);
    expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
    expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [ClusterConfigService]);
  });

  test('with useExisting', () => {
    const options: ClusterModuleAsyncOptions = { useExisting: ClusterConfigService };
    expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', CLUSTER_OPTIONS);
    expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
    expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [ClusterConfigService]);
  });

  test('without options', () => {
    expect(createAsyncOptionsProvider({})).toEqual({ provide: CLUSTER_OPTIONS, useValue: {} });
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

describe('clusterClientsProvider', () => {
  test('should be a dynamic module', () => {
    expect(clusterClientsProvider).toHaveProperty('provide', CLUSTER_CLIENTS);
    expect(clusterClientsProvider).toHaveProperty('useFactory');
    expect(clusterClientsProvider).toHaveProperty('inject', [CLUSTER_MERGED_OPTIONS]);
  });

  test('with multiple clients', async () => {
    const options: ClusterModuleOptions = { config: [{ nodes: [] }, { namespace: 'client1', nodes: [] }] };
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

describe('mergedOptionsProvider', () => {
  test('should be a dynamic module', () => {
    expect(mergedOptionsProvider).toHaveProperty('provide', CLUSTER_MERGED_OPTIONS);
    expect(mergedOptionsProvider).toHaveProperty('useFactory');
    expect(mergedOptionsProvider).toHaveProperty('inject', [CLUSTER_OPTIONS]);
  });

  test('should work correctly', async () => {
    const options: ClusterModuleOptions = { closeClient: false, config: { nodes: [] } };
    const mergedOptions = await mergedOptionsProvider.useFactory(options);
    expect(mergedOptions).toEqual({ ...defaultClusterModuleOptions, ...options });
  });
});
