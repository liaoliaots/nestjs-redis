## Usage

**First** we need to import the `RedisModule` into our root module:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            config: {
                host: 'localhost',
                port: 6380,
                password: 'redismain'
            }
        })
    ]
})
export class AppModule {}
```

> HINT: The `RedisModule` is a [global module](https://docs.nestjs.com/modules#global-modules). Once defined, this module is available everywhere.

> HINT: If you don't set the namespace for a client, its namespace is set to "default". Please note that you shouldn't have multiple client without a namespace, or with the same namespace, otherwise they will get overridden.

**Then** we can use redis in two ways.

via decorator:

```TypeScript
import { Injectable } from '@nestjs/common';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AppService {
    constructor(
        @InjectRedis() private readonly redis: Redis
        // or
        // @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis
    ) {}

    async ping(): Promise<string> {
        return await this.redis.ping();
    }
}
```

via service:

```TypeScript
import { Injectable } from '@nestjs/common';
import { RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AppService {
    private readonly redis: Redis;

    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getClient();
        // or
        // this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
    }

    async ping(): Promise<string> {
        return await this.redis.ping();
    }
}
```

### Use with other libs

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            readyLog: true,
            config: {
                host: 'localhost',
                port: 6380,
                password: 'redismain'
            }
        }),
        ThrottlerModule.forRootAsync({
            useFactory(redisService: RedisService) {
                const redis = redisService.getClient();
                return { ttl: 60, limit: 10, storage: new ThrottlerStorageRedisService(redis) };
            },
            inject: [RedisService]
        })
    ]
})
export class AppModule {}
```

## Configuration

### [RedisModuleOptions](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L49)

| Name                                                                                                                             | Type                                                                                        | Default     | Required | Description                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [closeClient](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L55)   | `boolean`                                                                                   | `true`      | `false`  | If set to `true`, all clients will be closed automatically on nestjs application shutdown. To use `closeClient`, you **must enable listeners** by calling `app.enableShutdownHooks()`. [Read more about the application shutdown.](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| [commonOptions](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L60) | [RedisOptions](https://github.com/luin/ioredis/blob/e41c3dc/lib/redis/RedisOptions.ts#L184) | `undefined` | `false`  | Common options to be passed to each client.                                                                                                                                                                                                                                                                    |
| [readyLog](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L67)      | `boolean`                                                                                   | `false`     | `false`  | If set to `true`, then ready logging will be displayed when the client is ready.                                                                                                                                                                                                                               |
| [errorLog](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L74)      | `boolean`                                                                                   | `true`      | `false`  | If set to `true`, then errors that occurred while connecting will be displayed by the built-in logger.                                                                                                                                                                                                         |
| [config](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L79)        | `RedisClientOptions` \| `RedisClientOptions`[]                                              | `undefined` | `false`  | Used to specify single or multiple clients.                                                                                                                                                                                                                                                                    |

### [RedisClientOptions](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L8)

| Name                                                                                                                               | Type                 | Default     | Required | Description                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [namespace](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L15)       | `string` \| `symbol` | `'default'` | `false`  | Client name. If client name is not given then it will be called `"default"`. Different clients must have different names. You can import `DEFAULT_REDIS_NAMESPACE` to use it.                                  |
| [url](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L29)             | `string`             | `undefined` | `false`  | URI scheme to be used to specify connection options as a [redis://](https://www.iana.org/assignments/uri-schemes/prov/redis) URL or [rediss://](https://www.iana.org/assignments/uri-schemes/prov/rediss) URL. |
| [path](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L34)            | `string`             | `undefined` | `false`  | Path to be used for Unix domain sockets.                                                                                                                                                                       |
| [onClientCreated](https://github.com/liaoliaots/nestjs-redis/blob/docs/lib/redis/interfaces/redis-module-options.interface.ts#L43) | `function`           | `undefined` | `false`  | Function to be executed as soon as the client is created.                                                                                                                                                      |
| **...**[RedisOptions](https://github.com/luin/ioredis/blob/e41c3dc/lib/redis/RedisOptions.ts#L184)                                 | `RedisOptions`       | -           | `false`  | Extends from [RedisOptions](https://luin.github.io/ioredis/index.html#RedisOptions).                                                                                                                           |

### Asynchronous configuration

via `useFactory`:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
                await somePromise();

                return {
                    config: {
                        host: 'localhost',
                        port: 6380,
                        password: 'redismain'
                    }
                };
            }
        })
    ]
})
export class AppModule {}
```

via `useClass`:

```TypeScript
import { Module, Injectable } from '@nestjs/common';
import { RedisModule, RedisOptionsFactory, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
    async createRedisOptions(): Promise<RedisModuleOptions> {
        await somePromise();

        return {
            config: {
                host: 'localhost',
                port: 6380,
                password: 'redismain'
            }
        };
    }
}

@Module({
    imports: [
        RedisModule.forRootAsync({
            useClass: RedisConfigService
        })
    ]
})
export class AppModule {}
```

via `extraProviders`:

```TypeScript
// just a simple example

import { Module, ValueProvider } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

const MyOptionsSymbol = Symbol('options');
const MyOptionsProvider: ValueProvider<RedisModuleOptions> = {
    provide: MyOptionsSymbol,
    useValue: {
        readyLog: true,
        config: {
            host: 'localhost',
            port: 6380,
            password: 'redismain'
        }
    }
};

@Module({
    imports: [
        RedisModule.forRootAsync({
            useFactory(options: RedisModuleOptions) {
                return options;
            },
            inject: [MyOptionsSymbol],
            extraProviders: [MyOptionsProvider]
        })
    ]
})
export class AppModule {}
```

... or via `useExisting`, if you wish to use an existing configuration provider imported from a different module.

```TypeScript
RedisModule.forRootAsync({
    imports: [ConfigModule],
    useExisting: ConfigService
})
```

### readyLog

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            readyLog: true,
            config: {
                host: 'localhost',
                port: 6380,
                password: 'redismain'
            }
        })
    ]
})
export class AppModule {}
```

The `RedisModule` will display a message when the server reports that it is ready to receive commands.

```sh
[Nest] 17581  - 09/16/2021, 6:03:35 PM     LOG [RedisModule] default: Connected successfully to the server
```

### Single client

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            config: {
                host: 'localhost',
                port: 6380,
                password: 'redismain'

                // or with URL
                // url: 'redis://:redismain@localhost:6380/0'
            }
        })
    ]
})
export class AppModule {}
```

### Multiple clients

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            config: [
                {
                    host: 'localhost',
                    port: 6380,
                    password: 'redismain'
                },
                {
                    namespace: 'master2',
                    host: 'localhost',
                    port: 6381,
                    password: 'redismaster'
                }
            ]
        })
    ]
})
export class AppModule {}
```

with URL:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            config: [
                {
                    url: 'redis://:redismain@localhost:6380/0'
                },
                {
                    namespace: 'master2',
                    url: 'redis://:redismaster@localhost:6381/0'
                }
            ]
        })
    ]
})
export class AppModule {}
```

### commonOptions

**In some cases**, you can move the same config of multiple clients to `commonOptions`.

> HINT: The `commonOptions` option works only with multiple clients.

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            commonOptions: {
                enableAutoPipelining: true
            },
            config: [
                {
                    host: 'localhost',
                    port: 6380,
                    password: 'redismain'
                },
                {
                    namespace: 'master2',
                    host: 'localhost',
                    port: 6381,
                    password: 'redismaster'
                }
            ]
        })
    ]
})
export class AppModule {}
```

You can also override the `commonOptions`:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            commonOptions: {
                enableAutoPipelining: true
            },
            config: [
                {
                    host: 'localhost',
                    port: 6380,
                    password: 'redismain'
                },
                {
                    namespace: 'master2',
                    host: 'localhost',
                    port: 6381,
                    password: 'redismaster',
                    enableAutoPipelining: false
                }
            ]
        })
    ]
})
export class AppModule {}
```

### onClientCreated

For example, we can listen to the error event of the redis client.

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            config: {
                host: 'localhost',
                port: 6380,
                password: 'redismain',
                onClientCreated(client) {
                    client.on('error', err => {});
                }
            }
        })
    ]
})
export class AppModule {}
```

### Non-global

By default, the `RedisModule` is registered in the global scope, so `RedisService` and `all redis clients defined` are available everywhere.

You can change the behavior by modifying `isGlobal` parameter:

```TypeScript
// cats.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Module({
    imports: [
        RedisModule.forRoot(
            {
                readyLog: true,
                config: {
                    host: 'localhost',
                    port: 6380,
                    password: 'redismain'
                }
            },
            false // <-- register inside the module scope
        )
    ],
    providers: [CatsService],
    controllers: [CatsController]
})
export class CatsModule {}
```

### Unix domain socket

### Testing
