import { Test, TestingModule } from '@nestjs/testing';
import { RedisHealthIndicator } from './indicators/redis.health';
import { RedisHealthModule } from './redis-health.module';

describe('RedisHealthModule', () => {
    let indicator: RedisHealthIndicator;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({ imports: [RedisHealthModule] }).compile();

        indicator = module.get<RedisHealthIndicator>(RedisHealthIndicator);
    });

    test('should be defined', () => {
        expect(indicator).toBeDefined();
    });
});
