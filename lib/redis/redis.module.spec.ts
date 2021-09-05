import { RedisModule } from './redis.module';
import { RedisModuleAsyncOptions } from './interfaces';

describe('RedisModule', () => {
    describe('forRoot', () => {
        test('should work correctly', () => {
            const module = RedisModule.forRoot();
            expect(module.module).toBe(RedisModule);
            expect(module.imports?.length).toBe(1);
        });
    });

    describe('forRootAsync', () => {
        test('should work correctly', () => {
            const options: RedisModuleAsyncOptions = { useFactory: () => ({}), inject: [] };
            const module = RedisModule.forRootAsync(options);
            expect(module.module).toBe(RedisModule);
            expect(module.imports?.length).toBe(1);
        });
    });
});
