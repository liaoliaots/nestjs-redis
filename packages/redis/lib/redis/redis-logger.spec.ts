import { Logger } from '@nestjs/common';
import { logger } from './redis-logger';

jest.mock('@nestjs/common', () => ({
  Logger: jest.fn()
}));

describe('logger', () => {
  test('should be defined', () => {
    expect(logger).toBeInstanceOf(Logger);
    expect(Logger).toHaveBeenCalledTimes(1);
  });
});
