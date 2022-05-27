## Usage

**First** we need to import the `ClusterModule` into our root module:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: 'localhost', port: 16380 }],
                redisOptions: { password: 'cluster1' }
            }
        })
    ]
})
export class AppModule {}
```

> HINT: The `ClusterModule` is a [global module](https://docs.nestjs.com/modules#global-modules). Once defined, this module is available everywhere.

> HINT: If you don't set the namespace for a client, its namespace is set to `"default"`. Please note that you shouldn't have multiple client without a namespace, or with the same namespace, otherwise they will get overridden.

**Then** we can use cluster in two ways.

via decorator:

```TypeScript
import { Injectable } from '@nestjs/common';
import { InjectCluster, DEFAULT_CLUSTER_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Cluster } from 'ioredis';

@Injectable()
export class AppService {
    constructor(
        @InjectCluster() private readonly cluster: Cluster
        // or
        // @InjectCluster(DEFAULT_CLUSTER_NAMESPACE) private readonly cluster: Cluster
    ) {}

    async ping(): Promise<string> {
        return await this.cluster.ping();
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
    private readonly cluster: Cluster;

    constructor(private readonly clusterService: ClusterService) {
        this.cluster = this.clusterService.getClient();
        // or
        // this.cluster = this.clusterService.getClient(DEFAULT_CLUSTER_NAMESPACE);
    }

    async ping(): Promise<string> {
        return await this.cluster.ping();
    }
}
```

## Configuration

### [ClusterModuleOptions](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L45)

| Name                                                                                                                               | Type                                               | Default     | Required | Description                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [closeClient](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L49) | `boolean`                                          | `true`      | `false`  | If set to `true`, all clients will be closed automatically on nestjs application shutdown. To use `closeClient`, you **must enable listeners** by calling `app.enableShutdownHooks()`. [Read more about the application shutdown.](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| [readyLog](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L56)    | `boolean`                                          | `false`     | `false`  | If set to `true`, then ready logging will be displayed when the client is ready.                                                                                                                                                                                                                               |
| [errorLog](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L63)    | `boolean`                                          | `true`      | `false`  | If set to `true`, then errors that occurred while connecting will be displayed by the built-in logger.                                                                                                                                                                                                         |
| [config](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L70)      | `ClusterClientOptions` \| `ClusterClientOptions`[] | `undefined` | `true`   | Used to specify single or multiple clients.                                                                                                                                                                                                                                                                    |

### [ClusterClientOptions](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L6)

| Name                                                                                                                                   | Type                                                             | Default     | Required | Description                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [namespace](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L10)       | `string` \| `symbol`                                             | `'default'` | `false`  | Client name. If client name is not given then it will be called "default". Different clients must have different names. You can import `DEFAULT_CLUSTER_NAMESPACE` to use it. |
| [nodes](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L18)           | `{ host?: string; port?: number }[]` \| `string[]` \| `number[]` | `undefined` | `true`   | List of cluster nodes.                                                                                                                                                        |
| [onClientCreated](https://github.com/liaoliaots/nestjs-redis/blob/main/lib/cluster/interfaces/cluster-module-options.interface.ts#L35) | `function`                                                       | `undefined` | `false`  | Function to be executed as soon as the client is created.                                                                                                                     |
| **...**[ClusterOptions](https://github.com/luin/ioredis/blob/main/lib/cluster/ClusterOptions.ts#L29)                                   | `ClusterOptions`                                                 | -           | `false`  | Extends from [ClusterOptions](https://luin.github.io/ioredis/interfaces/ClusterOptions.html).                                                                                 |

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
                    config: {
                        nodes: [{ host: 'localhost', port: 16380 }],
                        redisOptions: { password: 'cluster1' }
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
            config: {
                nodes: [{ host: 'localhost', port: 16380 }],
                redisOptions: { password: 'cluster1' }
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

via `extraProviders`:

```TypeScript
// just a simple example

import { Module, ValueProvider } from '@nestjs/common';
import { ClusterModule, ClusterModuleOptions } from '@liaoliaots/nestjs-redis';

const MyOptionsSymbol = Symbol('options');
const MyOptionsProvider: ValueProvider<ClusterModuleOptions> = {
    provide: MyOptionsSymbol,
    useValue: {
        readyLog: true,
        config: {
            nodes: [{ host: 'localhost', port: 16380 }],
            redisOptions: { password: 'cluster1' }
        }
    }
};

@Module({
    imports: [
        ClusterModule.forRootAsync({
            useFactory(options: ClusterModuleOptions) {
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
                nodes: [{ host: 'localhost', port: 16380 }],
                redisOptions: { password: 'cluster1' }
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
                nodes: [{ host: 'localhost', port: 16380 }],
                redisOptions: { password: 'cluster1' }

                // or with URL
                // nodes: ['redis://:cluster1@localhost:16380']
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
                    nodes: [{ host: 'localhost', port: 16380 }],
                    redisOptions: { password: 'cluster1' }
                },
                {
                    namespace: 'cluster2',
                    nodes: [{ host: 'localhost', port: 16480 }],
                    redisOptions: { password: 'cluster2' }
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
                    nodes: ['redis://:cluster1@localhost:16380']
                },
                {
                    namespace: 'cluster2',
                    nodes: ['redis://:cluster2@localhost:16480']
                }
            ]
        })
    ]
})
export class AppModule {}
```

### onClientCreated

For example, we can listen to the error event of the cluster client.

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: 'localhost', port: 16380 }],
                redisOptions: { password: 'cluster1' },
                onClientCreated(client) {
                    client.on('error', err => {});
                }
            }
        })
    ]
})
export class AppModule {}
```

### Non-Global

By default, the `ClusterModule` is registered in the global scope, so `ClusterService` and all cluster clients defined are available everywhere.

You can change the behavior by modifying `isGlobal` parameter:

```TypeScript
// cats.module.ts
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Module({
    imports: [
        ClusterModule.forRoot(
            {
                readyLog: true,
                config: {
                    nodes: [{ host: 'localhost', port: 16380 }],
                    redisOptions: { password: 'cluster1' }
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

### Testing

This package exposes `getClusterToken()` function that returns an internal injection token based on the provided context. Using this token, you can provide a mock implementation of the cluster client using any of the standard custom provider techniques, including `useClass`, `useValue`, and `useFactory`.

```ts
const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: getClusterToken('namespace'), useValue: mockedClient }, YourService]
}).compile();
```

A working example is available [here](../../sample/01-testing-inject/).
