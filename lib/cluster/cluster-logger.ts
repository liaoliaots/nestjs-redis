import { Logger } from '@nestjs/common';
import { CLUSTER_MODULE_ID } from './cluster.constants';

export const logger = new Logger(CLUSTER_MODULE_ID);
