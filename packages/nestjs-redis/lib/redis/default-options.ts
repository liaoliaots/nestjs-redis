import { RedisModuleOptions } from './interfaces';

export const defaultRedisModuleOptions: RedisModuleOptions = {
  closeClient: true,
  commonOptions: undefined,
  readyLog: false,
  errorLog: true,
  config: undefined
};
