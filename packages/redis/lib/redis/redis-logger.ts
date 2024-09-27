import { Logger } from '@nestjs/common';

export const logger = new Logger('RedisModule', { timestamp: true });
