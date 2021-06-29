# Welcome to nestjs-redis 👋

[![npm (tag)](https://img.shields.io/npm/v/@liaoliaots/nestjs-redis/latest?style=flat-square)](https://www.npmjs.com/package/@liaoliaots/nestjs-redis)
![npm](https://img.shields.io/npm/dw/@liaoliaots/nestjs-redis?style=flat-square)
[![GitHub](https://img.shields.io/github/license/liaoliaots/nestjs-redis?style=flat-square)](https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![CodeFactor](https://www.codefactor.io/repository/github/liaoliaots/nestjs-redis/badge)](https://www.codefactor.io/repository/github/liaoliaots/nestjs-redis)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/liaoliaots/nestjs-redis/graphs/commit-activity)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> Redis(ioredis) module for NestJS framework

## Features

-   Supports **redis** and **cluster**
-   Supports health check
-   Supports single or multiple clients
-   Supports inject a client directly or get a client via namespace

## Documentation

-   [Test coverage](#test-coverage)
-   [Install](#install)
-   [Redis](#redis)
-   [Cluster](#cluster)
-   [Examples](#examples)
-   [Package dependency overview](#package-dependency-overview)

## Test coverage

| Statements                                                                      | Branches                                                              | Functions                                                                | Lines                                                                 |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-94.66%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/branches-87.5%25-yellow.svg) | ![Functions](https://img.shields.io/badge/functions-87.69%25-yellow.svg) | ![Lines](https://img.shields.io/badge/lines-94.43%25-brightgreen.svg) |

## Install

**NOTE:** This lib requires **nestjs 7**, **ioredis 4**.

**NOTE:** Version **1** is deprecated, please use version **2**.

Install with npm

```sh
npm install @liaoliaots/nestjs-redis ioredis @nestjs/terminus
```

```sh
npm install --save-dev @types/ioredis
```

Install with yarn

```sh
yarn add @liaoliaots/nestjs-redis ioredis @nestjs/terminus
```

```sh
yarn add --dev @types/ioredis
```

## Redis

### Usage

**First**, register the RedisModule([a global module](https://docs.nestjs.com/modules#global-modules)) in app.module.ts:

with sync config:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            config: {
                host: '127.0.0.1',
                port: 6379
            }
        })
    ]
})
export class AppModule {}
```

with async config:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule, RedisOptionsFactory, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigService, ConfigModule } from '@nestjs/config';

class RedisConfigService implements RedisOptionsFactory {
    createRedisOptions(): RedisModuleOptions {
        return {
            closeClient: true,
            config: {}
        };
    }
}

@Module({
    imports: [
        RedisModule.forRootAsync({
            useFactory(configService: ConfigService) {
                const config = configService.get('redis');

                return {
                    closeClient: true,
                    config
                };
            },
            inject: [ConfigService],
            imports: [ConfigModule],

            // or use a class
            useClass: RedisConfigService,

            // or use an existing class
            useExisting: RedisConfigService // just a example
        })
    ]
})
export class AppModule {}
```

with single client:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            config: {
                host: 'localhost',
                port: 6379,

                // or with URL
                url: 'redis://:your_password@127.0.0.1:6379/0'
            }
        })
    ]
})
export class AppModule {}
```

with multiple clients:

**NOTE:** If you don't set the namespace for a client, its namespace is set to default. Please note that you shouldn't have multiple client without a namespace, or with the same namespace, otherwise they will get overridden.

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            config: [
                {
                    host: '127.0.0.1',
                    port: 6379,
                    db: 0,
                    enableAutoPipelining: true
                },
                {
                    namespace: 'cache',
                    host: '127.0.0.1',
                    port: 6379,
                    db: 1,
                    enableAutoPipelining: true
                }
            ]
        })
    ]
})
export class AppModule {}
```

You should notice that in the config above, those clients have the same config: host, port, and enableAutoPipelining. You can move the same config to **defaultOptions**.

**NOTE:** The **defaultOptions** only work with multiple clients.

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            defaultOptions: {
                host: '127.0.0.1',
                port: 6379,
                enableAutoPipelining: true
            },
            config: [
                {
                    db: 0
                },
                {
                    namespace: 'cache',
                    db: 1
                }
            ]
        })
    ]
})
export class AppModule {}
```

You can also override the **defaultOptions**:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            defaultOptions: {
                host: '127.0.0.1',
                port: 6379,
                enableAutoPipelining: true
            },
            config: [
                {
                    db: 0
                },
                {
                    namespace: 'cache',
                    db: 1,
                    enableAutoPipelining: false // will override the default
                }
            ]
        })
    ]
})
export class AppModule {}
```

with **onClientCreated**:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            config: {
                onClientCreated(client) {
                    client.on('error', err => {});
                    client.on('ready', () => {});
                },
                host: 'localhost',
                port: 6379
            }
        })
    ]
})
export class AppModule {}
```

**Next**, use redis clients:

via decorator:

```TypeScript
import { Controller, Get } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis, DEFAULT_REDIS_CLIENT } from '@liaoliaots/nestjs-redis';

@Controller('app')
export class AppController {
    constructor(
        @InjectRedis() private readonly client_default: Redis,
        // or
        @InjectRedis(DEFAULT_REDIS_CLIENT) private readonly client_default: Redis,

        @InjectRedis('cache') private readonly client_cache: Redis
    ) {}

    @Get('default')
    default(): Promise<string | null> {
        return this.client_default.get('key');
    }

    @Get('cache')
    cache(): Promise<string | null> {
        return this.client_cache.get('key');
    }
}
```

via service:

```TypeScript
import { Controller, Get } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService, DEFAULT_REDIS_CLIENT } from '@liaoliaots/nestjs-redis';

@Controller('app')
export class AppController {
    constructor(private readonly redisService: RedisService) {}

    @Get('default')
    default(): Promise<string | null> {
        const client: Redis = this.redisService.getClient();
        // or
        const client: Redis = this.redisService.getClient(DEFAULT_REDIS_CLIENT);

        return client.get('key');
    }

    @Get('cache')
    cache(): Promise<string | null> {
        const client: Redis = this.redisService.getClient('cache');

        return client.get('key');
    }
}
```

### Health check

**First**, register the [TerminusModule](https://docs.nestjs.com/recipes/terminus) in app.module.ts:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        TerminusModule,
        RedisModule.forRoot({
            closeClient: true,
            config: {
                host: 'localhost',
                port: 6379
            }
        })
    ]
})
export class AppModule {}
```

**Next**, use health check:

```TypeScript
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { RedisHealthIndicator, DEFAULT_REDIS_CLIENT } from '@liaoliaots/nestjs-redis';

@Controller('app')
export class AppController {
    constructor(private readonly health: HealthCheckService, private readonly redisIndicator: RedisHealthIndicator) {}

    @Get()
    healthCheck(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.redisIndicator.isHealthy('client_default', { namespace: DEFAULT_REDIS_CLIENT })
        ]);
    }
}
```

And then send a GET request to **/app**, if redis is in a healthy state, you will get:

```TypeScript
{
    status: 'ok',
    info: {
        client_default: {
            status: 'up'
        }
    },
    error: {},
    details: {
        client_default: {
            status: 'up'
        }
    }
}
```

### Options

#### RedisModuleOptions

| Name           | Type                                                                                          | Default value | Description                                                                         |
| -------------- | --------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| closeClient    | boolean                                                                                       | false         | If `true`, all clients will be closed automatically on nestjs application shutdown. |
| defaultOptions | [RedisOptions](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options) | undefined     | The default options for every client.                                               |
| config         | ClientOptions or ClientOptions[]                                                              | undefined     | Specify single or multiple clients.                                                 |

#### ClientOptions

| Name                                                                                            | Type             | Default value     | Description                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------- | ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace                                                                                       | string or symbol | Symbol('default') | The name of the client, and must be unique. You can import **DEFAULT_REDIS_CLIENT** to reference the default value.                                                                 |
| url                                                                                             | string           | undefined         | The URL([redis://](https://www.iana.org/assignments/uri-schemes/prov/redis) or [rediss://](https://www.iana.org/assignments/uri-schemes/prov/rediss)) specifies connection options. |
| onClientCreated                                                                                 | function         | undefined         | Once the client has been created, this function will be executed immediately.                                                                                                       |
| **...**[RedisOptions](https://github.com/luin/ioredis/blob/master/lib/redis/RedisOptions.ts#L8) | object           | -                 | Extends from the [RedisOptions](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options).                                                                     |

#### RedisHealthCheckOptions

| Name      | Type             | Default value | Description                                                           |
| --------- | ---------------- | ------------- | --------------------------------------------------------------------- |
| namespace | string or symbol | -             | The namespace of redis client, this client will execute health check. |

## Cluster

### Usage

### Health check

### Options

## Package dependency overview

![](./dependency-graph.svg)

## Examples

### Redis

## Author

👤 **LiaoLiao <yxiaosong002@gmail.com>**

-   Website: https://github.com/liaoliaots
-   Github: [@liaoliaots](https://github.com/liaoliaots)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/liaoliaots/nestjs-redis/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [LiaoLiao <yxiaosong002@gmail.com>](https://github.com/liaoliaots).

This project is [MIT](https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
