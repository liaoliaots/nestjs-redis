## Usage

**First**, we need to import the `ClusterModule` into our root module:

```ts
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ClusterModule.forRoot({
      config: {
        nodes: [{ host: 'localhost', port: 16380 }],
        redisOptions: { password: 'authpassword' }
      }
    })
  ]
})
export class AppModule {}
```

**Now**, we can use cluster in two ways.

via decorator:

```ts
import { Injectable } from '@nestjs/common';
import { InjectCluster, DEFAULT_CLUSTER_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Cluster } from 'ioredis';

@Injectable()
export class AppService {
  constructor(
    @InjectCluster() private readonly cluster: Cluster // or // @InjectCluster(DEFAULT_CLUSTER_NAMESPACE) private readonly cluster: Cluster
  ) {}

  async set() {
    return await this.cluster.set('key', 'value', 'EX', 10);
  }
}
```

via service:

```ts
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

  async set() {
    return await this.cluster.set('key', 'value', 'EX', 10);
  }
}
```

> HINT: By default, the `ClusterModule` is a [**Global module**](https://docs.nestjs.com/modules#global-modules).

> HINT: If you don't set the `namespace` for a client, its namespace is set to `"default"`. Please note that you shouldn't have multiple client without a namespace, or with the same namespace, otherwise they will get overridden.

## Configuration

### [ClusterModuleOptions](/packages/redis/lib/cluster/interfaces/cluster-module-options.interface.ts)

| Name        | Type                                               | Default     | Required | Description                                                                                                                                                                                                                                                                                                    |
| ----------- | -------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closeClient | `boolean`                                          | `true`      | `false`  | If set to `true`, all clients will be closed automatically on nestjs application shutdown. To use `closeClient`, you **must enable listeners** by calling `app.enableShutdownHooks()`. [Read more about the application shutdown.](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| readyLog    | `boolean`                                          | `false`     | `false`  | If set to `true`, then ready logging will be displayed when the client is ready.                                                                                                                                                                                                                               |
| errorLog    | `boolean`                                          | `true`      | `false`  | If set to `true`, then errors that occurred while connecting will be displayed by the built-in logger.                                                                                                                                                                                                         |
| config      | `ClusterClientOptions` \| `ClusterClientOptions`[] | `undefined` | `true`   | Used to specify single or multiple clients.                                                                                                                                                                                                                                                                    |

### [ClusterClientOptions](/packages/redis/lib/cluster/interfaces/cluster-module-options.interface.ts)

| Name                   | Type                                                             | Default     | Required | Description                                                                                                                                                                   |
| ---------------------- | ---------------------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace              | `string` \| `symbol`                                             | `'default'` | `false`  | Client name. If client name is not given then it will be called "default". Different clients must have different names. You can import `DEFAULT_CLUSTER_NAMESPACE` to use it. |
| nodes                  | `{ host?: string; port?: number }[]` \| `string[]` \| `number[]` | `undefined` | `true`   | List of cluster nodes.                                                                                                                                                        |
| onClientCreated        | `function`                                                       | `undefined` | `false`  | Function to be executed as soon as the client is created.                                                                                                                     |
| **...** ClusterOptions | `ClusterOptions`                                                 | -           | `false`  | Inherits from [ClusterOptions](https://luin.github.io/ioredis/interfaces/ClusterOptions.html).                                                                                |

### Asynchronous configuration

via `useFactory`:

```ts
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
            redisOptions: { password: 'authpassword' }
          }
        };
      }
    })
  ]
})
export class AppModule {}
```

via `useClass`:

```ts
import { Module, Injectable } from '@nestjs/common';
import { ClusterModule, ClusterOptionsFactory, ClusterModuleOptions } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ClusterConfigService implements ClusterOptionsFactory {
  async createClusterOptions(): Promise<ClusterModuleOptions> {
    await somePromise();

    return {
      config: {
        nodes: [{ host: 'localhost', port: 16380 }],
        redisOptions: { password: 'authpassword' }
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

```ts
// just a simple example

import { Module, ValueProvider } from '@nestjs/common';
import { ClusterModule, ClusterModuleOptions } from '@liaoliaots/nestjs-redis';

const MyOptionsSymbol = Symbol('options');
const MyOptionsProvider: ValueProvider<ClusterModuleOptions> = {
  provide: MyOptionsSymbol,
  useValue: {
    config: {
      nodes: [{ host: 'localhost', port: 16380 }],
      redisOptions: { password: 'authpassword' }
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

```ts
ClusterModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService
});
```

### readyLog

```ts
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ClusterModule.forRoot({
      readyLog: true,
      config: {
        nodes: [{ host: 'localhost', port: 16380 }],
        redisOptions: { password: 'authpassword' }
      }
    })
  ]
})
export class AppModule {}
```

The `ClusterModule` will display a message when `CLUSTER INFO` reporting the cluster is able to receive commands.

```sh
[Nest] 18886  - 09/16/2021, 6:19:56 PM     LOG [ClusterModule] default: connected successfully to the server
```

### Single client

```ts
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ClusterModule.forRoot({
      config: {
        nodes: [{ host: 'localhost', port: 16380 }],
        redisOptions: { password: 'authpassword' }

        // or with URL
        // nodes: ['redis://:authpassword@localhost:16380']
      }
    })
  ]
})
export class AppModule {}
```

### Multiple clients

```ts
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ClusterModule.forRoot({
      config: [
        {
          nodes: [{ host: 'localhost', port: 16380 }],
          redisOptions: { password: 'authpassword' }
        },
        {
          namespace: 'cluster2',
          nodes: [{ host: 'localhost', port: 16480 }],
          redisOptions: { password: 'authpassword' }
        }
      ]
    })
  ]
})
export class AppModule {}
```

with URL:

```ts
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ClusterModule.forRoot({
      config: [
        {
          nodes: ['redis://:authpassword@localhost:16380']
        },
        {
          namespace: 'cluster2',
          nodes: ['redis://:authpassword@localhost:16480']
        }
      ]
    })
  ]
})
export class AppModule {}
```

### onClientCreated

For example, we can listen to some events of the cluster instance.

```ts
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ClusterModule.forRoot({
      config: {
        nodes: [{ host: 'localhost', port: 16380 }],
        redisOptions: { password: 'authpassword' },
        onClientCreated(client) {
          client.on('error', err => {});
          client.on('ready', () => {});
        }
      }
    })
  ]
})
export class AppModule {}
```

### Non-Global

By default, the `ClusterModule` is a **Global module**, `ClusterService` and all cluster instances are registered in the global scope. Once defined, they're available everywhere.

You can change this behavior by `isGlobal` parameter:

```ts
// cats.module.ts
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Module({
  imports: [
    ClusterModule.forRoot(
      {
        config: {
          nodes: [{ host: 'localhost', port: 16380 }],
          redisOptions: { password: 'authpassword' }
        }
      },
      false // <-- providers are registered in the module scope
    )
  ],
  providers: [CatsService],
  controllers: [CatsController]
})
export class CatsModule {}
```

### Testing

This package exposes `getClusterToken()` function that returns an internal injection token based on the provided context. Using this token, you can provide a mock implementation of the cluster instance using any of the standard custom provider techniques, including `useClass`, `useValue`, and `useFactory`.

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRedisToken } from '@liaoliaots/nestjs-redis';

const module: TestingModule = await Test.createTestingModule({
  providers: [{ provide: getClusterToken('namespace'), useValue: mockedInstance }, YourService]
}).compile();
```

A working example is available [here](/sample).
