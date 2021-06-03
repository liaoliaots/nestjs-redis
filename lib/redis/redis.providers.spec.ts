import {
    createProviders,
    createAsyncProviders,
    createAsyncOptionsProvider,
    redisClientsProvider,
    createRedisClientProviders
} from './redis.providers';
import { RedisOptionsFactory } from './interfaces';

class RedisConfigService implements RedisOptionsFactory {
    createRedisOptions() {
        return {};
    }
}

describe(`${createProviders.name}`, () => {
    test('the result list should be defined', () => {
        expect(createProviders({})).toBeDefined();
    });

    test('the result list should have 2 members', () => {
        expect(createProviders({})).toHaveLength(2);
    });

    test('each of the members of the result list should be defined', () => {
        createProviders({}).forEach(provider => expect(provider).toBeDefined());
    });
});

describe(`${createAsyncProviders.name}`, () => {
    test('the result list should be defined', () => {
        expect(
            createAsyncProviders({
                useFactory: () => ({}),
                inject: []
            })
        ).toBeDefined();

        expect(
            createAsyncProviders({
                useClass: RedisConfigService
            })
        ).toBeDefined();

        expect(
            createAsyncProviders({
                useExisting: RedisConfigService
            })
        ).toBeDefined();
    });

    test('if use useFactory or useExisting, the result list should have 2 members', () => {
        expect(
            createAsyncProviders({
                useFactory: () => ({}),
                inject: []
            })
        ).toHaveLength(2);

        expect(
            createAsyncProviders({
                useExisting: RedisConfigService
            })
        ).toHaveLength(2);
    });

    test('if use useClass, the result list should have 3 members', () => {
        expect(
            createAsyncProviders({
                useClass: RedisConfigService
            })
        ).toHaveLength(3);
    });

    test('each of the members of the result list should be defined', () => {
        createAsyncProviders({
            useFactory: () => ({}),
            inject: []
        }).forEach(provider => expect(provider).toBeDefined());

        createAsyncProviders({
            useClass: RedisConfigService
        }).forEach(provider => expect(provider).toBeDefined());

        createAsyncProviders({
            useExisting: RedisConfigService
        }).forEach(provider => expect(provider).toBeDefined());
    });

    test('should throw an error when not specify useFactory, useClass and useExisting', () => {
        expect(() => createAsyncProviders({})).toThrow();
    });
});

describe(`${createAsyncOptionsProvider.name}`, () => {
    test('the result should be defined', () => {
        expect(
            createAsyncOptionsProvider({
                useFactory: () => ({}),
                inject: []
            })
        ).toBeDefined();

        expect(
            createAsyncOptionsProvider({
                useClass: RedisConfigService
            })
        ).toBeDefined();

        expect(
            createAsyncOptionsProvider({
                useExisting: RedisConfigService
            })
        ).toBeDefined();
    });
});

describe('redisClientsProvider', () => {
    test('the provider should be defined', () => {
        expect(redisClientsProvider).toBeDefined();
    });
});

describe(`${createRedisClientProviders.name}`, () => {
    test('the result list should have no members', () => {
        expect(createRedisClientProviders()).toHaveLength(0);
    });
});
