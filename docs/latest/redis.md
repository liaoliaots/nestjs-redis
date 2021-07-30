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
