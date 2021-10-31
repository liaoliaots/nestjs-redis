# Redis

## Usage

**Firstly**, we need to import the `RedisModule` into our root module:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            config: {
                host: '127.0.0.1',
                port: 6380,
                password: 'masterpassword1'
            }
        })
    ]
})
export class AppModule {}
```

> HINT: The `RedisModule` is a [global module](https://docs.nestjs.com/modules#global-modules). Once defined, this module is available everywhere.

**Now** we can use redis in two ways.

via decorator:

```TypeScript
import { Injectable } from '@nestjs/common';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
    constructor(
        @InjectRedis() private readonly defaultRedisClient: Redis
        // or
        // @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly defaultRedisClient: Redis
    ) {}

    async ping(): Promise<string> {
        return await this.defaultRedisClient.ping();
    }
}
```

via manager:

```TypeScript
import { Injectable } from '@nestjs/common';
import { RedisManager, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
    private readonly defaultRedisClient: Redis;

    constructor(private readonly redisManager: RedisManager) {
        this.defaultRedisClient = this.redisManager.getClient();
        // or
        // this.defaultRedisClient = this.redisManager.getClient(DEFAULT_REDIS_NAMESPACE);
    }

    async ping(): Promise<string> {
        return await this.defaultRedisClient.ping();
    }
}
```

### Use with other libraries that depend on redis

For example, use with `@nestjs/throttler` and `nestjs-throttler-storage-redis`:

```TypeScript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule, RedisManager } from '@liaoliaots/nestjs-redis';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            readyLog: true,
            config: {
                namespace: 'default',
                host: '127.0.0.1',
                port: 6380,
                password: 'masterpassword1'
            }
        }),
        ThrottlerModule.forRootAsync({
            useFactory(redisManager: RedisManager) {
                const redis = redisManager.getClient('default');
                return { ttl: 60, limit: 10, storage: new ThrottlerStorageRedisService(redis) };
            },
            inject: [RedisManager]
        })
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
```

## Configuration

### RedisModuleOptions

| Name          | Type                                 | Default value                     | Description                                                                                                                                                                                                                                                                                             |
| ------------- | ------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closeClient   | boolean                              | false                             | If `true`, all clients will be closed automatically on nestjs application shutdown. To use `closeClient`, you **must enable listeners** by calling `app.enableShutdownHooks()`. [Read more about the application shutdown.](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| commonOptions | object                               | undefined                         | The common options for each client.                                                                                                                                                                                                                                                                     |
| readyLog      | boolean                              | false                             | If `true`, will show a message when the client is ready.                                                                                                                                                                                                                                                |
| config        | `ClientOptions` or `ClientOptions`[] | { host: 'localhost', port: 6379 } | Specify single or multiple clients.                                                                                                                                                                                                                                                                     |

### ClientOptions

| Name                                                                                                 | Type             | Default value     | Description                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------- | ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace                                                                                            | string or symbol | Symbol('default') | The name of the client, and must be unique. You can import `DEFAULT_REDIS_NAMESPACE` to reference the default value.                                                                |
| url                                                                                                  | string           | undefined         | The URL([redis://](https://www.iana.org/assignments/uri-schemes/prov/redis) or [rediss://](https://www.iana.org/assignments/uri-schemes/prov/rediss)) specifies connection options. |
| onClientCreated                                                                                      | function         | undefined         | This function will be executed as soon as the client is created.                                                                                                                    |
| **...**[RedisOptions](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options) | object           | -                 | Extends the [RedisOptions](https://github.com/luin/ioredis/blob/master/lib/redis/RedisOptions.ts#L8).                                                                               |

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
                    closeClient: true,
                    config: {
                        host: '127.0.0.1',
                        port: 6380,
                        password: 'masterpassword1'
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
            closeClient: true,
            config: {
                host: '127.0.0.1',
                port: 6380,
                password: 'masterpassword1'
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
        closeClient: true,
        readyLog: true,
        config: {
            namespace: 'default',
            host: '127.0.0.1',
            port: 6380,
            password: 'masterpassword1'
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
                namespace: 'default',
                host: '127.0.0.1',
                port: 6380,
                password: 'masterpassword1'
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
                host: '127.0.0.1',
                port: 6380,
                password: 'masterpassword1'

                // or with URL
                // url: 'redis://:masterpassword1@127.0.0.1:6380/0'
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
                    host: '127.0.0.1',
                    port: 6380,
                    password: 'masterpassword1'
                },
                {
                    namespace: 'master2',
                    host: '127.0.0.1',
                    port: 6381,
                    password: 'masterpassword2'
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
                    url: 'redis://:masterpassword1@127.0.0.1:6380/0'
                },
                {
                    namespace: 'master2',
                    url: 'redis://:masterpassword2@127.0.0.1:6381/0'
                }
            ]
        })
    ]
})
export class AppModule {}
```

> HINT: If you don't set the namespace for a client, its namespace is set to default. Please note that you shouldn't have multiple client without a namespace, or with the same namespace, otherwise they will get overridden.

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
                    host: '127.0.0.1',
                    port: 6380,
                    password: 'masterpassword1'
                },
                {
                    namespace: 'master2',
                    host: '127.0.0.1',
                    port: 6381,
                    password: 'masterpassword2'
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
                    host: '127.0.0.1',
                    port: 6380,
                    password: 'masterpassword1'
                },
                {
                    namespace: 'master2',
                    host: '127.0.0.1',
                    port: 6381,
                    password: 'masterpassword2',
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
                host: '127.0.0.1',
                port: 6380,
                password: 'masterpassword1',
                onClientCreated(client) {
                    client.on('error', err => {});
                }
            }
        })
    ]
})
export class AppModule {}
```
