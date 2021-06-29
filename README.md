# Welcome to nestjs-redis 👋

[![npm (tag)](https://img.shields.io/npm/v/@liaoliaots/nestjs-redis/latest?style=flat-square)](https://www.npmjs.com/package/@liaoliaots/nestjs-redis)
![npm](https://img.shields.io/npm/dw/@liaoliaots/nestjs-redis?style=flat-square)
[![GitHub](https://img.shields.io/github/license/liaoliaots/nestjs-redis?style=flat-square)](https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![CodeFactor](https://www.codefactor.io/repository/github/liaoliaots/nestjs-redis/badge)](https://www.codefactor.io/repository/github/liaoliaots/nestjs-redis)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/liaoliaots/nestjs-redis/graphs/commit-activity)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> Redis([ioredis](https://github.com/luin/ioredis)) module for NestJS framework

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

**NOTE:** This lib requires **nestjs 7**, **ioredis 4**, **@nestjs/terminus 7**.

**NOTE:** Version 1 is deprecated, please use version **2**.

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

**First**, register the RedisModule([global module](https://docs.nestjs.com/modules#global-modules)) in app.module.ts:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot()]
})
export class AppModule {}
```

with async config:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({ config: configService.get('redis') }),
            inject: [ConfigService],
            imports: [ConfigModule]

            // useClass:

            // useExisting:
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
            config: {
                host: 'localhost',
                port: 6380,

                // or with URL
                // url: 'redis://:your_password@127.0.0.1:6380/0'
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
                    port: 6380,
                    db: 0,
                    enableAutoPipelining: true
                },
                {
                    namespace: 'cache',
                    host: '127.0.0.1',
                    port: 6380,
                    db: 1,
                    enableAutoPipelining: true
                }
            ]
        })
    ]
})
export class AppModule {}
```

**In some cases**, you can move the same config to **defaultOptions**.

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
                port: 6380,
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
                port: 6380,
                enableAutoPipelining: true
            },
            config: [
                {
                    db: 0
                },
                {
                    namespace: 'cache',
                    db: 1,
                    enableAutoPipelining: false // override the default options
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
            config: {
                onClientCreated(client) {
                    client.on('ready', () => {});
                    client.on('error', err => {});
                },
                host: 'localhost',
                port: 6380
            }
        })
    ]
})
export class AppModule {}
```

**Next**, use redis clients:

via decorator:

```TypeScript
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis, DEFAULT_REDIS_CLIENT } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AppService {
    constructor(
        @InjectRedis() private readonly clientDefault: Redis,
        // or
        // @InjectRedis(DEFAULT_REDIS_CLIENT) private readonly clientDefault: Redis,

        @InjectRedis('cache') private readonly clientCache: Redis
    ) {}

    async set(): Promise<void> {
        await this.clientDefault.set('foo', 'bar');

        await this.clientCache.set('foo', 'bar');
    }
}
```

via service:

```TypeScript
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { DEFAULT_REDIS_CLIENT, RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AppService {
    private clientDefault: Redis;

    private clientCache: Redis;

    private clients;

    constructor(private readonly redisService: RedisService) {
        this.clientDefault = this.redisService.getClient();
        // or
        // this.clientDefault = this.redisService.getClient(DEFAULT_REDIS_CLIENT);

        this.clientCache = this.redisService.getClient('cache');

        this.clients = this.redisService.clients; // get all clients
    }

    async set(): Promise<void> {
        await this.clientDefault.set('foo', 'bar');

        await this.clientCache.set('foo', 'bar');
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
    imports: [TerminusModule, RedisModule.forRoot({ config: { host: 'localhost', port: 6380 } })]
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
            () => this.redisIndicator.isHealthy('clientDefault', { namespace: DEFAULT_REDIS_CLIENT })
        ]);
    }
}
```

And then send a GET request to **/app**, if redis is in a healthy state, you will get:

```JSON
{
    status: 'ok',
    info: {
        clientDefault: {
            status: 'up'
        }
    },
    error: {},
    details: {
        clientDefault: {
            status: 'up'
        }
    }
}
```

### Options

#### RedisModuleOptions

| Name                                                                                            | Type                             | Default value | Description                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------- | -------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closeClient                                                                                     | boolean                          | false         | If `true`, all clients will be closed automatically on nestjs application shutdown. To use **closeClient**, you must enable listeners by calling **enableShutdownHooks()**: [details](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| [defaultOptions](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options) | object                           | undefined     | The default options for every client.                                                                                                                                                                                                                             |
| config                                                                                          | ClientOptions or ClientOptions[] | undefined     | Specify single or multiple clients.                                                                                                                                                                                                                               |

#### ClientOptions

| Name                                                                                            | Type             | Default value     | Description                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------- | ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace                                                                                       | string or symbol | Symbol('default') | The name of the client, and must be unique. You can import **DEFAULT_REDIS_CLIENT** to reference the default value.                                                                 |
| url                                                                                             | string           | undefined         | The URL([redis://](https://www.iana.org/assignments/uri-schemes/prov/redis) or [rediss://](https://www.iana.org/assignments/uri-schemes/prov/rediss)) specifies connection options. |
| onClientCreated                                                                                 | function         | undefined         | Once the client has been created, this function will be executed immediately.                                                                                                       |
| **...**[RedisOptions](https://github.com/luin/ioredis/blob/master/lib/redis/RedisOptions.ts#L8) | object           | -                 | Extends the [RedisOptions](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options).                                                                          |

#### RedisHealthCheckOptions

| Name      | Type             | Default value | Description                                                           |
| --------- | ---------------- | ------------- | --------------------------------------------------------------------- |
| namespace | string or symbol | -             | The namespace of redis client, this client will execute health check. |

## Cluster

**First**, register the ClusterModule([global module](https://docs.nestjs.com/modules#global-modules)) in app.module.ts:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: 'localhost', port: 16380 }]
            }
        })
    ]
})
export class AppModule {}
```

with async config:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ClusterModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({ config: configService.get('cluster') }),
            inject: [ConfigService],
            imports: [ConfigModule]

            // useClass:

            // useExisting:
        })
    ]
})
export class AppModule {}
```

with single client:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: 'localhost', port: 16380 }],
                options: { redisOptions: { password: 'your_password' } }
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
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            closeClient: true,
            config: [
                {
                    nodes: [{ host: 'localhost', port: 16380 }],
                    options: { redisOptions: { password: 'your_password' } }
                },
                {
                    namespace: 'cache',
                    nodes: [{ host: 'localhost', port: 16383 }],
                    options: { redisOptions: { password: 'your_password' } }
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
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                onClientCreated(client) {
                    client.on('ready', () => {});
                    client.on('error', err => {});
                },
                nodes: [{ host: 'localhost', port: 16380 }],
                options: { redisOptions: { password: 'your_password' } }
            }
        })
    ]
})
export class AppModule {}
```

**Next**, use cluster clients:

via decorator:

```TypeScript
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectCluster, DEFAULT_CLUSTER_CLIENT } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AppService {
    constructor(
        @InjectCluster() private readonly clientDefault: Redis,
        // or
        // @InjectCluster(DEFAULT_CLUSTER_CLIENT) private readonly clientDefault: Redis,

        @InjectCluster('cache') private readonly clientCache: Redis
    ) {}

    async set(): Promise<void> {
        await this.clientDefault.set('foo', 'bar');

        await this.clientCache.set('foo', 'bar');
    }
}
```

via service:

```TypeScript
import { Injectable } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { DEFAULT_CLUSTER_CLIENT, ClusterService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AppService {
    private clientDefault: Cluster;

    private clientCache: Cluster;

    private clients;

    constructor(private readonly clusterService: ClusterService) {
        this.clientDefault = this.clusterService.getClient();
        // or
        // this.clientDefault = this.clusterService.getClient(DEFAULT_CLUSTER_CLIENT);

        this.clientCache = this.clusterService.getClient('cache');

        this.clients = this.clusterService.clients; // get all clients
    }

    async set(): Promise<void> {
        await this.clientDefault.set('foo', 'bar');

        await this.clientCache.set('foo', 'bar');
    }
}

```

### Health check

**First**, register the [TerminusModule](https://docs.nestjs.com/recipes/terminus) in app.module.ts:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        TerminusModule,
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: 'localhost', port: 16380 }],
                options: { redisOptions: { password: 'your_password' } }
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
import { ClusterHealthIndicator, DEFAULT_CLUSTER_CLIENT } from '@liaoliaots/nestjs-redis';

@Controller('app')
export class AppController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly clusterIndicator: ClusterHealthIndicator
    ) {}

    @Get()
    healthCheck(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.clusterIndicator.isHealthy('clientDefault', { namespace: DEFAULT_CLUSTER_CLIENT })
        ]);
    }
}

```

And then send a GET request to **/app**, if redis is in a healthy state, you will get:

```JSON
{
    status: 'ok',
    info: {
        clientDefault: {
            status: 'up'
        }
    },
    error: {},
    details: {
        clientDefault: {
            status: 'up'
        }
    }
}
```

### Options

#### ClusterModuleOptions

| Name        | Type                             | Default value | Description                                                                                                                                                                                                                                                       |
| ----------- | -------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closeClient | boolean                          | false         | If `true`, all clients will be closed automatically on nestjs application shutdown. To use **closeClient**, you must enable listeners by calling **enableShutdownHooks()**: [details](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| config      | ClientOptions or ClientOptions[] | undefined     | Specify single or multiple clients.                                                                                                                                                                                                                               |

#### ClientOptions

| Name                                                                                        | Type                             | Default value     | Description                                                                                                           |
| ------------------------------------------------------------------------------------------- | -------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| namespace                                                                                   | string or symbol                 | Symbol('default') | The name of the client, and must be unique. You can import **DEFAULT_CLUSTER_CLIENT** to reference the default value. |
| [nodes](https://github.com/luin/ioredis/blob/master/API.md#new-clusterstartupnodes-options) | { port: number; host: string }[] | -                 | A list of nodes of the cluster.                                                                                       |
| [options](https://github.com/luin/ioredis/blob/master/lib/cluster/ClusterOptions.ts#L30)    | object                           | undefined         | The [cluster options](https://github.com/luin/ioredis/blob/master/API.md#new-clusterstartupnodes-options).            |
| onClientCreated                                                                             | function                         | undefined         | Once the client has been created, this function will be executed immediately.                                         |

#### ClusterHealthCheckOptions

| Name      | Type             | Default value | Description                                                             |
| --------- | ---------------- | ------------- | ----------------------------------------------------------------------- |
| namespace | string or symbol | -             | The namespace of cluster client, this client will execute health check. |

## Package dependency overview

![](./dependency-graph.svg)

## Examples

### Redis

-   If your redis server has no password, the host is localhost, and the port is 6379:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot()]
})
export class AppModule {}
```

-   If your redis sentinel config like this:

```TypeScript
master 127.0.0.1 6380
requirepass 123456

slave1 127.0.0.1 6381
requirepass 123456
slaveof 127.0.0.1 6380
masterauth 123456

slave2 127.0.0.1 6382
requirepass 123456
slaveof 127.0.0.1 6380
masterauth 123456

sentinel1 127.0.0.1 7380
requirepass 654321
sentinel monitor mymaster 127.0.0.1 6380 2
sentinel auth-pass mymaster 123456

sentinel2 127.0.0.1 7381
requirepass 654321
sentinel monitor mymaster 127.0.0.1 6380 2
sentinel auth-pass mymaster 123456
```

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            defaultOptions: {
                sentinels: [
                    {
                        host: 'localhost',
                        port: 7380
                    },
                    {
                        host: 'localhost',
                        port: 7381
                    }
                ],
                sentinelPassword: '654321',
                password: '123456'
            },
            config: [
                // represent master node
                { name: 'mymaster', role: 'master' },
                // represent a random slave node, read-only by default
                { namespace: 'random slave', name: 'mymaster', role: 'slave' },
                // represent a specific slave node, read-only by default
                // you should override the default sentinels
                { namespace: 'specific slave', host: 'localhost', port: 6381, password: '123456', sentinels: undefined }
            ]
        })
    ]
})
export class AppModule {}
```

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
