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
