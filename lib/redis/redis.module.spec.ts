import { RedisModule } from './redis.module';
import { RedisModuleAsyncOptions } from './interfaces';

describe(`${RedisModule.forRoot.name}`, () => {
    test('the result should be defined', () => {
        expect(RedisModule.forRoot()).toBeDefined();
    });

    test('the property module of the result should be equal to RedisModule', () => {
        expect(RedisModule.forRoot().module).toBe(RedisModule);
    });
});

describe(`${RedisModule.forRootAsync.name}`, () => {
    const options: RedisModuleAsyncOptions = {
        imports: [],
        useFactory: () => ({}),
        inject: []
    };

    test('the result should be defined', () => {
        expect(RedisModule.forRootAsync(options)).toBeDefined();
    });

    test('the property module of the result should be equal to RedisModule', () => {
        expect(RedisModule.forRootAsync(options).module).toBe(RedisModule);
    });
});
