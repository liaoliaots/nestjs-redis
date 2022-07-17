[![NPM][npm-shield]][npm-url]
[![Downloads][downloads-shield]][downloads-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
![Vulnerabilities][vulnerabilities-shield]
[![License][license-shield]][license-url]

<p align="center">
  <a href="https://nestjs.com/">
    <img src="https://nestjs.com/img/logo-small.svg" alt="Nest Logo" width="120">
  </a>
</p>

<div align="center">
  <h1 align="center">Nest Redis Health Module</h1>

  <p align="center">
    Redis(ioredis) health checks module for Nest framework (node.js).
    <br />
    <a href="#usage"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/liaoliaots/nestjs-redis/issues">Report Bug</a>
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
    <li><a href="#settings">Settings</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="./dependency-graph.svg">Package dependency overview</a></li>
  </ol>
</details>

## About The Project

### Features

- **Both redis & cluster are supported**.
- **Health**: Checks health of **redis & cluster** server.
- **Rigorously tested**: With 20+ tests and 100% code coverage.

### Test coverage

| Statements                                                                                                | Branches                                                                                              | Functions                                                                                               | Lines                                                                                           |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat-square&logo=jest) |

## Getting Started

### Prerequisites

This lib requires **Node.js >=12.22.0**, **NestJS ^9.0.0**, **ioredis ^5.0.0**.

### Installation

```sh
# with npm
npm install @nestjs/terminus @liaoliaots/nestjs-redis-health ioredis
# with yarn
yarn add @nestjs/terminus @liaoliaots/nestjs-redis-health ioredis
# with pnpm
pnpm add @nestjs/terminus @liaoliaots/nestjs-redis-health ioredis
```

## Usage

**1**, import `TerminusModule` and `RedisHealthModule` into the imports array:

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { AppController } from './app.controller';

@Module({
  imports: [TerminusModule, RedisHealthModule],
  controllers: [AppController]
})
export class AppModule {}
```

**2**, let's setup `AppController`:

```ts
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import Redis from 'ioredis';

@Controller()
export class AppController {
  private readonly redis: Redis;

  constructor(private readonly health: HealthCheckService, private readonly redisIndicator: RedisHealthIndicator) {
    this.redis = new Redis({ host: 'localhost', port: 6379, password: 'authpassword' });
  }

  @Get('health')
  @HealthCheck()
  async healthChecks(): Promise<HealthCheckResult> {
    return await this.health.check([
      () => this.redisIndicator.checkHealth('redis', { type: 'redis', client: this.redis, timeout: 500 })
    ]);
  }
}
```

**3**, if your redis server is reachable, you should now see the following JSON-result when requesting http://localhost:3000/health with a GET request:

```json
{
  "status": "ok",
  "info": {
    "redis": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "redis": {
      "status": "up"
    }
  }
}
```

> INFO: Read more about `@nestjs/terminus` [here](https://docs.nestjs.com/recipes/terminus).

> HINT: Both `TerminusModule` and `RedisHealthModule` are not global modules.

## Settings

### Redis

| Name            | Type      | Default     | Required | Description                                                                                           |
| --------------- | --------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| type            | `'redis'` | `undefined` | `true`   | Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". |
| client          | `Redis`   | `undefined` | `true`   | The client which the health check should get executed.                                                |
| timeout         | `number`  | `1000`      | `false`  | The amount of time the check should require in `ms`.                                                  |
| memoryThreshold | `number`  | `undefined` | `false`  | The maximum amount of memory used by redis in `bytes`.                                                |

### Cluster

| Name   | Type        | Default     | Required | Description                                                                                           |
| ------ | ----------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| type   | `'cluster'` | `undefined` | `true`   | Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". |
| client | `Cluster`   | `undefined` | `true`   | The client which the health check should get executed.                                                |

## License

Distributed under the MIT License. See `LICENSE` for more information.

[npm-shield]: https://img.shields.io/npm/v/@liaoliaots/nestjs-redis-health/latest?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@liaoliaots/nestjs-redis-health
[downloads-shield]: https://img.shields.io/npm/dm/@liaoliaots/nestjs-redis-health?style=for-the-badge
[downloads-url]: https://www.npmjs.com/package/@liaoliaots/nestjs-redis-health
[stars-shield]: https://img.shields.io/github/stars/liaoliaots/nestjs-redis?style=for-the-badge
[stars-url]: https://github.com/liaoliaots/nestjs-redis/stargazers
[issues-shield]: https://img.shields.io/github/issues/liaoliaots/nestjs-redis?style=for-the-badge
[issues-url]: https://github.com/liaoliaots/nestjs-redis/issues
[license-shield]: https://img.shields.io/npm/l/@liaoliaots/nestjs-redis?style=for-the-badge
[license-url]: https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE
[vulnerabilities-shield]: https://img.shields.io/snyk/vulnerabilities/npm/@liaoliaots/nestjs-redis-health?style=for-the-badge
