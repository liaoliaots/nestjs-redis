import { RedisModule } from './redis.module';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './interfaces';

describe(`${RedisModule.forRoot.name}`, () => {
    test('should register the module with options', () => {
        const redisModuleOptions: RedisModuleOptions = {};

        expect(RedisModule.forRoot(redisModuleOptions).module).toBe(RedisModule);
        expect(RedisModule.forRoot(redisModuleOptions).imports).toHaveLength(1);
    });

    test('should register the module without options', () => {
        expect(RedisModule.forRoot().module).toBe(RedisModule);
        expect(RedisModule.forRoot().imports).toHaveLength(1);
    });
});

describe(`${RedisModule.forRootAsync.name}`, () => {
    const options: RedisModuleAsyncOptions = { imports: [], useFactory: () => ({}), inject: [] };

    test('should register the async module with async options', () => {
        expect(RedisModule.forRootAsync(options).module).toBe(RedisModule);
        expect(RedisModule.forRootAsync(options).imports).toHaveLength(1);
    });
});
