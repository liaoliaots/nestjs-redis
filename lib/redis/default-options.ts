import { RedisModuleOptions } from './interfaces';

export const defaultRedisModuleOptions: RedisModuleOptions = {
    closeClient: true,
    readyLog: false,
    config: undefined,
    commonOptions: undefined
};
