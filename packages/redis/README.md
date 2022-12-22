[![NPM][npm-shield]][npm-url]
[![Downloads][downloads-shield]][downloads-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
![Vulnerabilities][vulnerabilities-shield]
[![Workflow][workflow-shield]][workflow-url]

<p align="center">
  <a href="https://nestjs.com/">
    <img src="https://nestjs.com/img/logo-small.svg" alt="Nest Logo" width="120">
  </a>
</p>

<div align="center">
  <h1 align="center">Nest Redis Module</h1>

  <p align="center">
    Redis(ioredis) module for Nest framework (node.js).
    <br />
    <a href="#usage"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="/sample">View Demos</a>
    ·
    <a href="https://github.com/liaoliaots/nestjs-redis/issues/new/choose">Report Bug</a>
    ·
    <a href="https://github.com/liaoliaots/nestjs-redis/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#test-coverage">Test coverage</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#faqs">FAQs</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

### Features

- **Both redis & cluster are supported**: You can also specify multiple instances.
- **Health**: Checks health of **redis & cluster** server.
- **Rigorously tested**: With 100+ tests and 100% code coverage.
- **Decorators**: Injects **redis & cluster** clients via `@InjectRedis()`, `@InjectCluster()`.
- **Services**: Retrieves **redis & cluster** clients via `RedisService`, `ClusterService`.
- **Testing**: Generates an injection token via `getRedisToken`, `getClusterToken`.

### Test coverage

| Statements                                                                                                | Branches                                                                                              | Functions                                                                                               | Lines                                                                                           |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat-square&logo=jest) |

## Getting Started

### Prerequisites

This lib requires **Node.js >=12.22.0**, **NestJS ^9.0.0**, **ioredis ^5.0.0**.

- If you depend on **ioredis 4**, please use [version 7](https://github.com/liaoliaots/nestjs-redis/tree/v7.0.0) of the lib.
- If you depend on **ioredis 5**, **NestJS 7** or **8**, please use [version 8](https://github.com/liaoliaots/nestjs-redis/tree/v8.2.2) of the lib.

### Installation

```sh
# with npm
npm install @liaoliaots/nestjs-redis ioredis
# with yarn
yarn add @liaoliaots/nestjs-redis ioredis
# with pnpm
pnpm add @liaoliaots/nestjs-redis ioredis
```

## Usage

- [Redis](/docs/latest/redis.md)
  - [Usage](/docs/latest/redis.md)
  - [Configuration](/docs/latest/redis.md#configuration)
  - [Testing](/docs/latest/redis.md#testing)
  - [Non-Global](/docs/latest/redis.md#non-global)
  - [Auto-reconnect](https://luin.github.io/ioredis/interfaces/CommonRedisOptions.html#retryStrategy)
  - [Unix domain socket](/docs/latest/redis.md#unix-domain-socket)
- [Cluster](/docs/latest/cluster.md)
  - [Usage](/docs/latest/cluster.md)
  - [Configuration](/docs/latest/cluster.md#configuration)
  - [Testing](/docs/latest/cluster.md#testing)
  - [Non-Global](/docs/latest/cluster.md#non-global)
  - [Auto-reconnect](https://luin.github.io/ioredis/interfaces/ClusterOptions.html#clusterRetryStrategy)
- [Health Checks](/packages/redis-health/README.md)
- [Examples](/docs/latest/examples.md)
  - [Redis Sentinel](/docs/latest/examples.md#sentinel)

### Legacy

- version 7, [click here](/docs/v7)
- version 8, [click here](/docs/v8)

## FAQs

### Circular dependency ⚠️

<details>
  <summary>Click to expand</summary>

[A circular dependency](https://docs.nestjs.com/fundamentals/circular-dependency) might also be caused when using "barrel files"/index.ts files to group imports. Barrel files should be omitted when it comes to module/provider classes. For example, barrel files should not be used when importing files within the same directory as the barrel file, i.e. `cats/cats.controller` should not import `cats` to import the `cats/cats.service` file. For more details please also see [this github issue](https://github.com/nestjs/nest/issues/1181#issuecomment-430197191).

</details>

### "Cannot resolve dependency" error

<details>
  <summary>Click to expand</summary>

If you encountered an error like this:

```
Nest can't resolve dependencies of the <provider> (?). Please make sure that the argument <unknown_token> at index [<index>] is available in the <module> context.

Potential solutions:
- If <unknown_token> is a provider, is it part of the current <module>?
- If <unknown_token> is exported from a separate @Module, is that module imported within <module>?
  @Module({
    imports: [ /* the Module containing <unknown_token> */ ]
  })
```

Please make sure that the `RedisModule` is added directly to the `imports` array of `@Module()` decorator of "Root Module"(if `isGlobal` is true) or "Feature Module"(if `isGlobal` is false).

Examples of code:

```ts
// redis-config.service.ts
import { Injectable } from '@nestjs/common';
import { RedisModuleOptions, RedisOptionsFactory } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  createRedisOptions(): RedisModuleOptions {
    return {
      readyLog: true,
      config: {
        host: 'localhost',
        port: 6379,
        password: 'authpassword'
      }
    };
  }
}
```

### ✅ Correct

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from './redis-config.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisConfigService
    })
  ]
})
export class AppModule {}
```

### ❌ Incorrect

```ts
// my-redis.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from './redis-config.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisConfigService
    })
  ]
})
export class MyRedisModule {}
```

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { MyRedisModule } from './my-redis.module';

@Module({
  imports: [MyRedisModule]
})
export class AppModule {}
```

</details>

## Roadmap

- [x] Compatible with **NestJS ^9**
- [ ] Flexible custom logger
- [ ] Add some examples for **TLS**

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Full-Featured Redis Client - ioredis](https://github.com/luin/ioredis)
- [Official Redis Documentation](https://redis.io/)
- [Official Redis Docker Image](https://hub.docker.com/_/redis)
- [Official Bitnami Redis Docker Image](https://hub.docker.com/r/bitnami/redis)

[npm-shield]: https://img.shields.io/npm/v/@liaoliaots/nestjs-redis/latest?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@liaoliaots/nestjs-redis
[downloads-shield]: https://img.shields.io/npm/dm/@liaoliaots/nestjs-redis?style=for-the-badge
[downloads-url]: https://www.npmjs.com/package/@liaoliaots/nestjs-redis
[stars-shield]: https://img.shields.io/github/stars/liaoliaots/nestjs-redis?style=for-the-badge
[stars-url]: https://github.com/liaoliaots/nestjs-redis/stargazers
[issues-shield]: https://img.shields.io/github/issues/liaoliaots/nestjs-redis?style=for-the-badge
[issues-url]: https://github.com/liaoliaots/nestjs-redis/issues
[license-shield]: https://img.shields.io/npm/l/@liaoliaots/nestjs-redis?style=for-the-badge
[license-url]: https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE
[vulnerabilities-shield]: https://img.shields.io/snyk/vulnerabilities/npm/@liaoliaots/nestjs-redis?style=for-the-badge
[workflow-shield]: https://img.shields.io/github/actions/workflow/status/liaoliaots/nestjs-redis/testing.yaml?label=TESTING&style=for-the-badge
[workflow-url]: https://github.com/liaoliaots/nestjs-redis/actions/workflows/testing.yaml
