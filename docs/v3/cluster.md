# Cluster

## Usage

**Firstly**, we need to import the `ClusterModule` into our root module:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            closeClient: true,
            config: {
                nodes: [{ host: '127.0.0.1', port: 16380 }],
                options: { redisOptions: { password: 'clusterpassword1' } }
            }
        })
    ]
})
export class AppModule {}
```

> HINT: The `ClusterModule` is a [global module](https://docs.nestjs.com/modules#global-modules). Once defined, this module is available everywhere.

**Now** we can use cluster in two ways.

via decorator:

```TypeScript
import { Injectable } from '@nestjs/common';
import { InjectCluster, DEFAULT_CLUSTER_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Cluster } from 'ioredis';

@Injectable()
export class AppService {
    constructor(
        @InjectCluster() private readonly defaultClusterClient: Cluster
        // or
        // @InjectCluster(DEFAULT_CLUSTER_NAMESPACE) private readonly defaultClusterClient: Cluster
    ) {}

    async ping(): Promise<string> {
        return await this.defaultClusterClient.ping();
    }
}
```

via service:

```TypeScript
import { Injectable } from '@nestjs/common';
import { ClusterService, DEFAULT_CLUSTER_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Cluster } from 'ioredis';

@Injectable()
export class AppService {
    private readonly defaultClusterClient: Cluster;

    constructor(private readonly clusterService: ClusterService) {
        this.defaultClusterClient = this.clusterService.getClient();
        // or
        // this.defaultClusterClient = this.clusterService.getClient(DEFAULT_CLUSTER_NAMESPACE);
    }

    async ping(): Promise<string> {
        return await this.defaultClusterClient.ping();
    }
}
```

## Configuration

### ClusterModuleOptions

| Name        | Type                                 | Default value | Description                                                                                                                                                                                                                                                                                             |
| ----------- | ------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closeClient | boolean                              | false         | If `true`, all clients will be closed automatically on nestjs application shutdown. To use `closeClient`, you **must enable listeners** by calling `app.enableShutdownHooks()`. [Read more about the application shutdown.](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| readyLog    | boolean                              | false         | If `true`, will show a message when the client is ready.                                                                                                                                                                                                                                                |
| config      | `ClientOptions` or `ClientOptions`[] | {}            | Specify single or multiple clients.                                                                                                                                                                                                                                                                     |

### ClientOptions

| Name                                                                                          | Type                                               | Default value     | Description                                                                                                                                                            |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace                                                                                     | string or symbol                                   | Symbol('default') | The name of the client, and must be unique. You can import `DEFAULT_CLUSTER_NAMESPACE` to reference the default value.                                                 |
| [nodes](https://github.com/luin/ioredis/blob/master/API.md#new-clusterstartupnodes-options)   | `{ host?: string; port?: number }[]` or `string[]` | -                 | A list of nodes of the cluster. The **first** argument of `new Cluster(startupNodes, options).`                                                                        |
| [options](https://github.com/luin/ioredis/blob/master/API.md#new-clusterstartupnodes-options) | object                                             | undefined         | The [cluster options](https://github.com/luin/ioredis/blob/master/lib/cluster/ClusterOptions.ts#L30). The **second** argument of `new Cluster(startupNodes, options).` |
| onClientCreated                                                                               | function                                           | undefined         | This function will be executed as soon as the client is created.                                                                                                       |

### Asynchronous configuration

via `useFactory`:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule, ClusterModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ClusterModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<ClusterModuleOptions> => {
                await somePromise();

                return {
                    closeClient: true,
                    config: {
                        nodes: [{ host: '127.0.0.1', port: 16380 }],
                        options: { redisOptions: { password: 'clusterpassword1' } }
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
import { ClusterModule, ClusterOptionsFactory, ClusterModuleOptions } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ClusterConfigService implements ClusterOptionsFactory {
    async createClusterOptions(): Promise<ClusterModuleOptions> {
        await somePromise();

        return {
            closeClient: true,
            config: {
                nodes: [{ host: '127.0.0.1', port: 16380 }],
                options: { redisOptions: { password: 'clusterpassword1' } }
            }
        };
    }
}

@Module({
    imports: [
        ClusterModule.forRootAsync({
            useClass: ClusterConfigService
        })
    ]
})
export class AppModule {}
```

... or via `useExisting`, if you wish to use an existing configuration provider imported from a different module.

```TypeScript
ClusterModule.forRootAsync({
    imports: [ConfigModule],
    useExisting: ConfigService
})
```

### readyLog

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            readyLog: true,
            config: {
                namespace: 'default',
                nodes: [{ host: '127.0.0.1', port: 16380 }],
                options: { redisOptions: { password: 'clusterpassword1' } }
            }
        })
    ]
})
export class AppModule {}
```

The `ClusterModule` will display a message when `CLUSTER INFO` reporting the cluster is able to receive commands.

```sh
[Nest] 18886  - 09/16/2021, 6:19:56 PM     LOG [ClusterModule] default: Connected successfully to the server
```

### Single client

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: '127.0.0.1', port: 16380 }],
                options: { redisOptions: { password: 'clusterpassword1' } }

                // or with URL
                // nodes: ['redis://:clusterpassword1@127.0.0.1:16380']
            }
        })
    ]
})
export class AppModule {}
```

### Multiple clients

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: [
                {
                    nodes: [{ host: '127.0.0.1', port: 16380 }],
                    options: { redisOptions: { password: 'clusterpassword1' } }
                },
                {
                    namespace: 'cluster2',
                    nodes: [{ host: '127.0.0.1', port: 16480 }],
                    options: { redisOptions: { password: 'clusterpassword2' } }
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
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: [
                {
                    nodes: ['redis://:clusterpassword1@127.0.0.1:16380']
                },
                {
                    namespace: 'cluster2',
                    nodes: ['redis://:clusterpassword2@127.0.0.1:16480']
                }
            ]
        })
    ]
})
export class AppModule {}
```

> HINT: If you don't set the namespace for a client, its namespace is set to default. Please note that you shouldn't have multiple client without a namespace, or with the same namespace, otherwise they will get overridden.

### onClientCreated

For example, we can listen to the error event of the cluster client.

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: '127.0.0.1', port: 16380 }],
                options: { redisOptions: { password: 'clusterpassword1' } },
                onClientCreated(client) {
                    client.on('error', err => {});
                }
            }
        })
    ]
})
export class AppModule {}
```
