import { Module, DynamicModule, Provider, OnApplicationShutdown, Inject } from '@nestjs/common';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisClients } from './interfaces';
import { RedisManager } from './redis-manager';
import {
  createOptionsProvider,
  createAsyncProviders,
  createRedisClientProviders,
  redisClientsProvider,
  mergedOptionsProvider
} from './redis.providers';
import { REDIS_CLIENTS, REDIS_MERGED_OPTIONS } from './redis.constants';
import { destroy } from './common';
import { parseNamespace, isResolution, isRejection, isError } from '@/utils';
import { logger } from './redis-logger';
import { MissingConfigurationsError } from '@/errors';
import { ERROR_LOG } from '@/messages';

/**
 * @public
 */
@Module({})
export class RedisModule implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_MERGED_OPTIONS) private readonly options: RedisModuleOptions,
    @Inject(REDIS_CLIENTS) private readonly clients: RedisClients
  ) {}

  /**
   * Registers the module synchronously.
   */
  static forRoot(options: RedisModuleOptions = {}, isGlobal = true): DynamicModule {
    const redisClientProviders = createRedisClientProviders();
    const providers: Provider[] = [
      createOptionsProvider(options),
      redisClientsProvider,
      mergedOptionsProvider,
      RedisManager,
      ...redisClientProviders
    ];

    return {
      global: isGlobal,
      module: RedisModule,
      providers,
      exports: [RedisManager, ...redisClientProviders]
    };
  }

  /**
   * Registers the module asynchronously.
   */
  static forRootAsync(options: RedisModuleAsyncOptions, isGlobal = true): DynamicModule {
    if (!options.useFactory && !options.useClass && !options.useExisting) {
      throw new MissingConfigurationsError();
    }

    const redisClientProviders = createRedisClientProviders();
    const providers: Provider[] = [
      ...createAsyncProviders(options),
      redisClientsProvider,
      mergedOptionsProvider,
      RedisManager,
      ...redisClientProviders,
      ...(options.extraProviders ?? [])
    ];

    return {
      global: isGlobal,
      module: RedisModule,
      imports: options.imports,
      providers,
      exports: [RedisManager, ...redisClientProviders]
    };
  }

  async onApplicationShutdown() {
    if (this.options.closeClient) {
      const results = await destroy(this.clients);
      results.forEach(([namespace, quit]) => {
        if (isResolution(namespace) && isRejection(quit) && isError(quit.reason)) {
          logger.error(ERROR_LOG(parseNamespace(namespace.value), quit.reason.message), quit.reason.stack);
        }
      });
    }
  }
}
