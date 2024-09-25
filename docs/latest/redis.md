## Usage

**First**, we need to import the `RedisModule` into our root module:

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'authpassword'
      }
    })
  ]
})
export class AppModule {}
```

**Now**, we can use redis in two ways.

```ts
import { Injectable } from '@nestjs/common';
import { RedisService, DEFAULT_REDIS } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  private readonly redis: Redis | null;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
    // same as
    // this.redis = this.redisService.getOrThrow(DEFAULT_REDIS);

    // or
    // this.redis = this.redisService.getOrNil();
    // same as
    // this.redis = this.redisService.getOrNil(DEFAULT_REDIS);
  }

  async set() {
    return await this.redis.set('key', 'value', 'EX', 10);
  }
}
```

> HINT: By default, the `RedisModule` is a [**Global module**](https://docs.nestjs.com/modules#global-modules).

> HINT: If you don't set the `namespace` for a client, its namespace is set to `"default"`. Please note that you shouldn't have multiple client without a namespace, or with the same namespace, otherwise they will get overridden.

### Use with other libs

```ts
// an example
import { Module } from '@nestjs/common';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'authpassword'
      }
    }),
    ThrottlerModule.forRootAsync({
      useFactory(redisService: RedisService) {
        const redis = redisService.getClient();
        return { ttl: 60, limit: 600, storage: new ThrottlerStorageRedisService(redis, 1000) };
      },
      inject: [RedisService]
    })
  ]
})
export class AppModule {}
```

## Configuration

### [RedisModuleOptions](/packages/redis/lib/redis/interfaces/redis-module-options.interface.ts)

| Name          | Type                                                                   | Default     | Required | Description                                                                                                                                                                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| closeClient   | `boolean`                                                              | `true`      | `false`  | If set to `true`, all clients will be closed automatically on nestjs application shutdown. To use `closeClient`, you **must enable listeners** by calling `app.enableShutdownHooks()`. [Read more about the application shutdown.](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) |
| commonOptions | [RedisOptions](https://luin.github.io/ioredis/index.html#RedisOptions) | `undefined` | `false`  | Common options to be passed to each client.                                                                                                                                                                                                                                                                    |
| readyLog      | `boolean`                                                              | `true`      | `false`  | If set to `true`, then ready logging will be displayed when the client is ready.                                                                                                                                                                                                                               |
| errorLog      | `boolean`                                                              | `true`      | `false`  | If set to `true`, then errors that occurred while connecting will be displayed by the built-in logger.                                                                                                                                                                                                         |
| config        | `RedisClientOptions` \| `RedisClientOptions`[]                         | `undefined` | `false`  | Used to specify single or multiple clients.                                                                                                                                                                                                                                                                    |

### [RedisClientOptions](/packages/redis/lib/redis/interfaces/redis-module-options.interface.ts)

| Name                 | Type                 | Default     | Required | Description                                                                                                                                                                                                    |
| -------------------- | -------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace            | `string` \| `symbol` | `'default'` | `false`  | Client name. If client name is not given then it will be called `"default"`. Different clients must have different names. You can import `DEFAULT_REDIS_NAMESPACE` to use it.                                  |
| url                  | `string`             | `undefined` | `false`  | URI scheme to be used to specify connection options as a [redis://](https://www.iana.org/assignments/uri-schemes/prov/redis) URL or [rediss://](https://www.iana.org/assignments/uri-schemes/prov/rediss) URL. |
| path                 | `string`             | `undefined` | `false`  | Path to be used for Unix domain sockets.                                                                                                                                                                       |
| onClientCreated      | `function`           | `undefined` | `false`  | Function to be executed as soon as the client is created.                                                                                                                                                      |
| **...** RedisOptions | `RedisOptions`       | -           | `false`  | Inherits from [RedisOptions](https://luin.github.io/ioredis/index.html#RedisOptions).                                                                                                                          |

### Asynchronous configuration

via `useFactory`:

```ts
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
            port: 6379,
            password: 'authpassword'
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
import { RedisModule, RedisOptionsFactory, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  async createRedisOptions(): Promise<RedisModuleOptions> {
    await somePromise();

    return {
      config: {
        host: 'localhost',
        port: 6379,
        password: 'authpassword'
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

```ts
// an example

import { Module, ValueProvider } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

const MyOptionsSymbol = Symbol('options');
const MyOptionsProvider: ValueProvider<RedisModuleOptions> = {
  provide: MyOptionsSymbol,
  useValue: {
    config: {
      host: 'localhost',
      port: 6379,
      password: 'authpassword'
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

```ts
RedisModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService
});
```

### readyLog

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: 'localhost',
        port: 6379,
        password: 'authpassword'
      }
    })
  ]
})
export class AppModule {}
```

The `RedisModule` will display a message when the server reports that it is ready to receive commands.

```sh
[Nest] 17581  - 09/16/2021, 6:03:35 PM     LOG [RedisModule] default: connected successfully to the server
```

### Single client

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'authpassword'

        // or with URL
        // url: 'redis://:authpassword@localhost:6379/0'
      }
    })
  ]
})
export class AppModule {}
```

### Multiple clients

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: [
        {
          host: 'localhost',
          port: 6379,
          password: 'authpassword'
        },
        {
          namespace: 'master2',
          host: 'localhost',
          port: 6380,
          password: 'authpassword'
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
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: [
        {
          url: 'redis://:authpassword@localhost:6379/0'
        },
        {
          namespace: 'master2',
          url: 'redis://:authpassword@localhost:6380/0'
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

```ts
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
          port: 6379,
          password: 'authpassword'
        },
        {
          namespace: 'master2',
          host: 'localhost',
          port: 6380,
          password: 'authpassword'
        }
      ]
    })
  ]
})
export class AppModule {}
```

You can also override the `commonOptions`:

```ts
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
          port: 6379,
          password: 'authpassword'
        },
        {
          namespace: 'master2',
          host: 'localhost',
          port: 6380,
          password: 'authpassword',
          enableAutoPipelining: false
        }
      ]
    })
  ]
})
export class AppModule {}
```

### onClientCreated

For example, we can listen to some events of the redis instance.

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'authpassword',
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

By default, the `RedisModule` is a **Global module**, `RedisService` and all redis instances are registered in the global scope. Once defined, they're available everywhere.

You can change this behavior by `isGlobal` parameter:

```ts
// cats.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Module({
  imports: [
    RedisModule.forRoot(
      {
        config: {
          host: 'localhost',
          port: 6379,
          password: 'authpassword'
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

### Unix domain socket

**1**, open your **_redis.conf_** in a text editor and scroll down until you get to the unix socket section:

```
# Unix socket.
#
# Specify the path for the Unix socket that will be used to listen for
# incoming connections. There is no default, so Redis will not listen
# on a unix socket when not specified.
#
# unixsocket /run/redis.sock
# unixsocketperm 700
```

**2**, uncomment these lines, now look like this:

```
# create a unix domain socket
unixsocket /run/redis.sock
# set permissions to 777
unixsocketperm 777
```

**3**, save and exit, then restart your redis server.

**4**, let's setup our application:

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        path: '/run/redis.sock'
      }
    })
  ]
})
export class AppModule {}
```

And there we go.
