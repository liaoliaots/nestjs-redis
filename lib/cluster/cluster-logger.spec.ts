import { Logger } from '@nestjs/common';
import { logger } from './cluster-logger';
import { CLUSTER_MODULE_ID } from './cluster.constants';

jest.mock('@nestjs/common', () => ({
    Logger: jest.fn()
}));

describe('logger', () => {
    test('should be defined', () => {
        expect(logger).toBeDefined();
        expect(Logger).toHaveBeenCalledTimes(1);
        expect(Logger).toHaveBeenCalledWith(CLUSTER_MODULE_ID);
    });
});
