import { RedisModuleOptions } from './interfaces';

export const defaultRedisModuleOptions: RedisModuleOptions = {
  closeClient: true,
  commonOptions: undefined,
  readyLog: true,
  errorLog: true,
  config: {}
};
