import { RedisModuleOptions } from './interfaces';

export const defaultRedisModuleOptions: RedisModuleOptions = {
    closeClient: false,
    readyLog: false,
    // ! https://github.com/luin/ioredis/blob/master/lib/redis/RedisOptions.ts#L35
    config: { host: 'localhost', port: 6379 },
    commonOptions: undefined
};
