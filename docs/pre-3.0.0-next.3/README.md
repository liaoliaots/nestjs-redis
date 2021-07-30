# Welcome to nestjs-redis 👋

[![npm (tag)](https://img.shields.io/npm/v/@liaoliaots/nestjs-redis/latest?style=flat-square)](https://www.npmjs.com/package/@liaoliaots/nestjs-redis)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@liaoliaots/nestjs-redis/next?style=flat-square)](https://www.npmjs.com/package/@liaoliaots/nestjs-redis/v/3.0.0-next.2)
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
-   Supports specify single or multiple clients
-   Supports inject a client directly or get a client via namespace

## Documentation

-   [Test coverage](#test-coverage)
-   [Install](#install)
-   [Redis](#redis)
    -   [Usage](#redis-usage)
    -   [Health check](#redis-health-check)
    -   [Options](#redis-options)
-   [Cluster](#cluster)
    -   [Usage](#cluster-usage)
    -   [Health check](#cluster-health-check)
    -   [Options](#cluster-options)
-   [Examples](#examples)
    -   [Redis](#examples-redis)
        -   [default](#examples-default)
        -   [sentinel](#examples-sentinel)
    -   [Cluster](#examples-cluster)
-   [Package dependency overview](#package-dependency-overview)
-   [Todo](#todo)

## Test coverage

| Statements                                                                      | Branches                                                               | Functions                                                                | Lines                                                                 |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-92.47%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/branches-88.64%25-yellow.svg) | ![Functions](https://img.shields.io/badge/functions-84.85%25-yellow.svg) | ![Lines](https://img.shields.io/badge/lines-92.67%25-brightgreen.svg) |

## Install

### NestJS 8:

```sh
$ npm install --save @liaoliaots/nestjs-redis@next ioredis @nestjs/terminus@next
$ npm install --save-dev @types/ioredis
```

```sh
$ yarn add @liaoliaots/nestjs-redis@next ioredis @nestjs/terminus@next
$ yarn add --dev @types/ioredis
```

### NestJS 7:

```sh
$ npm install --save @liaoliaots/nestjs-redis@2 ioredis @nestjs/terminus@7
$ npm install --save-dev @types/ioredis
```

```sh
$ yarn add @liaoliaots/nestjs-redis@2 ioredis @nestjs/terminus@7
$ yarn add --dev @types/ioredis
```

## Redis

<h3 id="redis-usage">Usage</h3>

**First**, register the RedisModule in app.module.ts:

The RedisModule is a [global module](https://docs.nestjs.com/modules#global-modules). Once defined, the module is available everywhere.

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
                // url: 'redis://:your_password@localhost:6380/0'
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
                    host: 'localhost',
                    port: 6380,
                    db: 0,
                    enableAutoPipelining: true
                },
                {
                    namespace: 'cache',
                    host: 'localhost',
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
                host: 'localhost',
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
                host: 'localhost',
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

<h3 id="redis-health-check">Health check</h3>

**First**, register the [TerminusModule](https://docs.nestjs.com/recipes/terminus) in app.module.ts:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [RedisModule.forRoot({ config: { host: 'localhost', port: 6380 } }), TerminusModule]
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

```TypeScript
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

<h3 id="redis-options">Options</h3>

#### RedisModuleOptions

| Name                                                                                            | Type                             | Default value | Description                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------- | -------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closeClient                                                                                     | boolean                          | false         | If `true`, all clients will be closed automatically on nestjs application shutdown. To use **closeClient**, you must enable listeners by calling **enableShutdownHooks()**. [See details.](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| [defaultOptions](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options) | object                           | undefined     | The default options for every client.                                                                                                                                                                                                                                  |
| config                                                                                          | ClientOptions or ClientOptions[] | {}            | Specify single or multiple clients.                                                                                                                                                                                                                                    |

#### ClientOptions

| Name                                                                                                 | Type             | Default value     | Description                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------- | ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace                                                                                            | string or symbol | Symbol('default') | The name of the client, and must be unique. You can import **DEFAULT_REDIS_CLIENT** to reference the default value.                                                                 |
| url                                                                                                  | string           | undefined         | The URL([redis://](https://www.iana.org/assignments/uri-schemes/prov/redis) or [rediss://](https://www.iana.org/assignments/uri-schemes/prov/rediss)) specifies connection options. |
| onClientCreated                                                                                      | function         | undefined         | Once the client has been created, this function will be executed immediately.                                                                                                       |
| **...**[RedisOptions](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options) | object           | -                 | Extends the [RedisOptions](https://github.com/luin/ioredis/blob/master/lib/redis/RedisOptions.ts#L8).                                                                               |

#### RedisHealthCheckOptions

| Name      | Type             | Default value | Description                                                           |
| --------- | ---------------- | ------------- | --------------------------------------------------------------------- |
| namespace | string or symbol | -             | The namespace of redis client, this client will execute health check. |

## Cluster

<h3 id="cluster-usage">Usage</h3>

**First**, register the ClusterModule in app.module.ts:

The ClusterModule is a [global module](https://docs.nestjs.com/modules#global-modules). Once defined, the module is available everywhere.

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
import { Cluster } from 'ioredis';
import { InjectCluster, DEFAULT_CLUSTER_CLIENT } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AppService {
    constructor(
        @InjectCluster() private readonly clientDefault: Cluster,
        // or
        // @InjectCluster(DEFAULT_CLUSTER_CLIENT) private readonly clientDefault: Redis,

        @InjectCluster('cache') private readonly clientCache: Cluster
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

<h3 id="cluster-health-check">Health check</h3>

**First**, register the [TerminusModule](https://docs.nestjs.com/recipes/terminus) in app.module.ts:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: 'localhost', port: 16380 }],
                options: { redisOptions: { password: 'your_password' } }
            }
        }),
        TerminusModule
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

```TypeScript
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

<h3 id="cluster-options">Options</h3>

#### ClusterModuleOptions

| Name        | Type                             | Default value | Description                                                                                                                                                                                                                                                            |
| ----------- | -------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closeClient | boolean                          | false         | If `true`, all clients will be closed automatically on nestjs application shutdown. To use **closeClient**, you must enable listeners by calling **enableShutdownHooks()**. [See details.](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| config      | ClientOptions or ClientOptions[] | {}            | Specify single or multiple clients.                                                                                                                                                                                                                                    |

#### ClientOptions

| Name                                                                                          | Type                             | Default value     | Description                                                                                                           |
| --------------------------------------------------------------------------------------------- | -------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| namespace                                                                                     | string or symbol                 | Symbol('default') | The name of the client, and must be unique. You can import **DEFAULT_CLUSTER_CLIENT** to reference the default value. |
| [nodes](https://github.com/luin/ioredis/blob/master/API.md#new-clusterstartupnodes-options)   | { port: number; host: string }[] | -                 | A list of nodes of the cluster.                                                                                       |
| [options](https://github.com/luin/ioredis/blob/master/API.md#new-clusterstartupnodes-options) | object                           | undefined         | The [cluster options](https://github.com/luin/ioredis/blob/master/lib/cluster/ClusterOptions.ts#L30).                 |
| onClientCreated                                                                               | function                         | undefined         | Once the client has been created, this function will be executed immediately.                                         |

#### ClusterHealthCheckOptions

| Name      | Type             | Default value | Description                                                             |
| --------- | ---------------- | ------------- | ----------------------------------------------------------------------- |
| namespace | string or symbol | -             | The namespace of cluster client, this client will execute health check. |

## Examples

<h3 id="examples-redis">Redis</h3>

-   If your redis server has no password, the host is localhost, and the port is 6379: <span id="examples-default"></span>

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot()]
})
export class AppModule {}
```

or

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot({ config: {} })]
})
export class AppModule {}
```

or

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot({ config: { namespace: 'cache' } })]
})
export class AppModule {}
```

-   If redis sentinel config is: <span id="examples-sentinel"></span>

| name                     | ip        | port | password |
| ------------------------ | --------- | ---- | -------- |
| master                   | localhost | 6380 | 123456   |
| slave1                   | localhost | 6381 | 123456   |
| slave2                   | localhost | 6382 | 123456   |
| sentinel1 (**mymaster**) | localhost | 7380 | 654321   |
| sentinel2 (**mymaster**) | localhost | 7381 | 654321   |

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
                // get master node from the sentinel group
                { name: 'mymaster', role: 'master' },
                // get a random slave node from the sentinel group, read-only by default
                { namespace: 'random slave', name: 'mymaster', role: 'slave' }
            ]
        })
    ]
})
export class AppModule {}
```

<h3 id="examples-cluster">Cluster</h3>

-   If cluster config is:

cluster 1:

| name    | ip        | port  | password |
| ------- | --------- | ----- | -------- |
| master1 | localhost | 16380 | 123456   |
| master2 | localhost | 16381 | 123456   |
| master3 | localhost | 16382 | 123456   |

cluster 2:

| name    | ip        | port  | password |
| ------- | --------- | ----- | -------- |
| master1 | localhost | 16383 | 654321   |
| master2 | localhost | 16384 | 654321   |
| master3 | localhost | 16385 | 654321   |

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: [
                {
                    nodes: [{ host: 'localhost', port: 16380 }],
                    options: { redisOptions: { password: '123456' } }
                },
                {
                    namespace: 'cache',
                    nodes: [{ host: 'localhost', port: 16383 }],
                    options: { redisOptions: { password: '654321' } }
                }
            ]
        })
    ]
})
export class AppModule {}
```

## Package dependency overview

![](./dependency-graph.svg)

## Todo

-   Load `@nestjs/terminus` lazily

## Author

👤 **LiaoLiao**

-   Website: https://github.com/liaoliaots
-   Github: [@liaoliaots](https://github.com/liaoliaots)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/liaoliaots/nestjs-redis/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [LiaoLiao](https://github.com/liaoliaots).

This project is [MIT](https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
