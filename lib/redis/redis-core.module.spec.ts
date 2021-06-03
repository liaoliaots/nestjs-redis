import { RedisCoreModule } from './redis-core.module';
import { RedisModuleAsyncOptions } from './interfaces';

describe(`${RedisCoreModule.forRoot.name}`, () => {
    test('the result should be defined', () => {
        expect(RedisCoreModule.forRoot()).toBeDefined();
    });

    test('the property module of the result should be equal to RedisCoreModule', () => {
        expect(RedisCoreModule.forRoot().module).toBe(RedisCoreModule);
    });

    test('the property providers of the result and its members should be defined', () => {
        expect(RedisCoreModule.forRoot().providers).toBeDefined();
        RedisCoreModule.forRoot().providers?.forEach(provider => expect(provider).toBeDefined());
    });

    test('the property exports of the result and its members should be defined', () => {
        expect(RedisCoreModule.forRoot().exports).toBeDefined();
        RedisCoreModule.forRoot().exports?.forEach(item => expect(item).toBeDefined());
    });
});

describe(`${RedisCoreModule.forRootAsync.name}`, () => {
    const options: RedisModuleAsyncOptions = {
        imports: [],
        useFactory: () => ({}),
        inject: []
    };

    test('the result should be defined', () => {
        expect(RedisCoreModule.forRootAsync(options)).toBeDefined();
    });

    test('the property module of the result should be equal to RedisCoreModule', () => {
        expect(RedisCoreModule.forRootAsync(options).module).toBe(RedisCoreModule);
    });

    test('the property providers of the result and its members should be defined', () => {
        expect(RedisCoreModule.forRootAsync(options).providers).toBeDefined();
        RedisCoreModule.forRootAsync(options).providers?.forEach(provider => expect(provider).toBeDefined());
    });

    test('the property exports of the result and its members should be defined', () => {
        expect(RedisCoreModule.forRootAsync(options).exports).toBeDefined();
        RedisCoreModule.forRootAsync(options).exports?.forEach(item => expect(item).toBeDefined());
    });

    test('the property imports of the result should be defined', () => {
        expect(RedisCoreModule.forRootAsync(options).imports).toBeDefined();
    });
});
