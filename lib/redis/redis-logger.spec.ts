import { Logger } from '@nestjs/common';
import { logger } from './redis-logger';
import { REDIS_MODULE_ID } from './redis.constants';

jest.mock('@nestjs/common', () => ({
    Logger: jest.fn()
}));

describe('logger', () => {
    test('should be defined', () => {
        expect(logger).toBeDefined();
        expect(Logger).toHaveBeenCalledTimes(1);
        expect(Logger).toHaveBeenCalledWith(REDIS_MODULE_ID);
    });
});
