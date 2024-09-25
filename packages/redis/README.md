![NPM Version](https://img.shields.io/npm/v/%40liaoliaots%2Fnestjs-redis%2Falpha?style=for-the-badge)
[![Downloads][downloads-shield]][downloads-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

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
- **Services**: Retrieves **redis & cluster** connection via `RedisService`, `ClusterService`.

### Test coverage

| Statements                                                                                                | Branches                                                                                              | Functions                                                                                               | Lines                                                                                           |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat-square&logo=jest) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat-square&logo=jest) |

## Getting Started

### Prerequisites

This lib requires **Node.js >=16.13.0**, **NestJS ^10.0.0**, **ioredis ^5.0.0**.

- If you depend on **ioredis 5** & **NestJS 10**, please use version **10** of the lib.
- If you depend on **ioredis 5** & **NestJS 9**, please use version **9** of the lib.
- If you depend on **ioredis 5**, **NestJS 7** or **8**, please use [version 8](https://github.com/liaoliaots/nestjs-redis/tree/v8.2.2) of the lib.
- If you depend on **ioredis 4**, please use [version 7](https://github.com/liaoliaots/nestjs-redis/tree/v7.0.0) of the lib.

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

- version 9, [click here](/docs/v9)
- version 8, [click here](/docs/v8)
- version 7, [click here](/docs/v7)

## FAQs

### Circular dependency ⚠️

<details>
  <summary>Click to expand</summary>

[A circular dependency](https://docs.nestjs.com/fundamentals/circular-dependency) might also be caused when using "barrel files"/index.ts files to group imports. Barrel files should be omitted when it comes to module/provider classes. For example, barrel files should not be used when importing files within the same directory as the barrel file, i.e. `cats/cats.controller` should not import `cats` to import the `cats/cats.service` file. For more details please also see [this github issue](https://github.com/nestjs/nest/issues/1181#issuecomment-430197191).

</details>

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

[downloads-shield]: https://img.shields.io/npm/dm/@liaoliaots/nestjs-redis?style=for-the-badge
[downloads-url]: https://www.npmjs.com/package/@liaoliaots/nestjs-redis
[stars-shield]: https://img.shields.io/github/stars/liaoliaots/nestjs-redis?style=for-the-badge
[stars-url]: https://github.com/liaoliaots/nestjs-redis/stargazers
[issues-shield]: https://img.shields.io/github/issues/liaoliaots/nestjs-redis?style=for-the-badge
[issues-url]: https://github.com/liaoliaots/nestjs-redis/issues
[license-shield]: https://img.shields.io/npm/l/@liaoliaots/nestjs-redis?style=for-the-badge
[license-url]: https://github.com/liaoliaots/nestjs-redis/blob/main/LICENSE
