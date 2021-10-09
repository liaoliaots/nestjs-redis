import { RedisModuleOptions } from './interfaces';

export const defaultRedisModuleOptions: RedisModuleOptions = {
    closeClient: false,
    readyLog: false,
    config: { host: 'localhost', port: 6379 },
    commonOptions: undefined
};
