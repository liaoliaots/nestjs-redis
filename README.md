<h1 align="center">Welcome to @liaoliaots/nestjs-redis 👋</h1>

[![npm (tag)](https://img.shields.io/npm/v/@liaoliaots/nestjs-redis/latest?style=flat-square)](https://www.npmjs.com/package/@liaoliaots/nestjs-redis)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@liaoliaots/nestjs-redis/next?style=flat-square)](https://www.npmjs.com/package/@liaoliaots/nestjs-redis/v/3.0.0-next.3)
![npm](https://img.shields.io/npm/dw/@liaoliaots/nestjs-redis?style=flat-square)
[![GitHub](https://img.shields.io/github/license/liaoliaots/nestjs-redis?style=flat-square)](https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![CodeFactor](https://www.codefactor.io/repository/github/liaoliaots/nestjs-redis/badge)](https://www.codefactor.io/repository/github/liaoliaots/nestjs-redis)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/liaoliaots/nestjs-redis/graphs/commit-activity)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> Redis([ioredis](https://github.com/luin/ioredis)) module for NestJS framework

## Features

-   Supports **redis** and **cluster**
-   Supports health checks
-   Can specify single or multiple clients
-   Can inject a redis/cluster client via `@InjectRedis()` and `@InjectCluster()` decorator
-   Can get a redis/cluster client via `RedisService` and `ClusterService`

## Documentation

_For the legacy V2 or V3@next documentation, [click here](https://github.com/liaoliaots/nestjs-redis/blob/main/docs/v2/README.md)._

-   [Test coverage](#test-coverage)
-   [Install](#install)
-   [Redis](https://github.com/liaoliaots/nestjs-redis/blob/main/docs/v3/redis.md)
-   [Cluster](https://github.com/liaoliaots/nestjs-redis/blob/main/docs/v3/cluster.md)
-   [Health Checks](https://github.com/liaoliaots/nestjs-redis/blob/main/docs/v3/health-check.md)
-   [Test a class](#test-a-class)
-   [Examples](https://github.com/liaoliaots/nestjs-redis/blob/main/docs/v3/examples.md)
-   [Package dependency overview](#package-dependency-overview)

## Test coverage

| Statements                                                                    | Branches                                                                  | Functions                                                                   | Lines                                                               |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg) |

## Install

### NestJS 8:

```sh
$ npm install --save @liaoliaots/nestjs-redis ioredis
$ npm install --save-dev @types/ioredis
```

```sh
$ yarn add @liaoliaots/nestjs-redis ioredis
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

## Test a class

This package exports `getRedisToken()` and `getClusterToken()` functions that return an internal injection token based on the provided context. Using this token, you can provide a mock implementation of the redis/cluster client using any of the standard custom provider techniques, including `useClass`, `useValue`, and `useFactory`.

```TypeScript
const module: TestingModule = await Test.createTestingModule({
    providers: [{ provide: getRedisToken('your client namespace'), useValue: mockClient }, YourService]
}).compile();
```

## TODO

-   [ ] select db

## Package dependency overview

![](https://github.com/liaoliaots/nestjs-redis/blob/main/docs/v3/dependency-graph.svg)

## Author

👤 **LiaoLiao**

-   Github: [@liaoliaots](https://github.com/liaoliaots)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/liaoliaots/nestjs-redis/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [LiaoLiao](https://github.com/liaoliaots).<br />
This project is [MIT](https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
