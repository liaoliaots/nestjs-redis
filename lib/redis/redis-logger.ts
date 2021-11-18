import { Logger } from '@nestjs/common';
import { REDIS_MODULE_ID } from './redis.constants';

export const logger = new Logger(REDIS_MODULE_ID);
