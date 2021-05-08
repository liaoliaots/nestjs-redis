import { Provider } from '@nestjs/common';
import { RedisModuleOptions } from './redis.interface';
import { REDIS_OPTIONS } from './redis.constants';

/**
 * Returns the list of provider for forRoot
 *
 * @param options - The options of redis module
 */
export const createProviders = (options: RedisModuleOptions): Provider[] => {
    return [
        {
            provide: REDIS_OPTIONS,
            useValue: options
        }
    ];
};
