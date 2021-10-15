import { RedisModuleOptions } from './interfaces';

export const defaultRedisModuleOptions: RedisModuleOptions = {
    closeClient: false,
    readyLog: false,
    config: undefined,
    commonOptions: undefined
};
