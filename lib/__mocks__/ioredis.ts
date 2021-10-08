import { Cluster, Redis } from 'ioredis';

const mockIORedis = jest.createMockFromModule<{ default: Redis }>('ioredis/built/redis').default;
Reflect.defineProperty(mockIORedis, 'Cluster', {
    enumerable: true,
    value: jest.createMockFromModule<{ default: Cluster }>('ioredis/built/cluster').default
});

export default mockIORedis;
