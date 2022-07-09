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
  <h1 align="center">NestJS Redis Module</h1>

  <p align="center">
    Redis(ioredis) module for Nest framework (node.js).
    <br />
    <a href="#usage"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="sample">View Demo</a>
    ·
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="docs/latest/dependency-graph.svg">Package dependency overview</a></li>
  </ol>
</details>

## About The Project

### Features

- **Both redis & cluster are supported**: You can also specify multiple instances.
- **Health**: Checks health of **redis & cluster** server.
- **Rigorously tested**: With 130+ tests and 100% code coverage.
- **Decorators**: Injects **redis & cluster** clients via `@InjectRedis()`, `@InjectCluster()`.
- **Services**: Retrieves **redis & cluster** clients via `RedisService`, `ClusterService`.
- **Testing**: Generates an injection token via `getRedisToken`, `getClusterToken`.

### Test coverage

| Statements                                                                                      | Branches                                                                                    | Functions                                                                                     | Lines                                                                                 |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat-square) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat-square) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat-square) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat-square) |

## Getting Started

### Prerequisites

This lib requires **Node.js >=12.22.0**, **NestJS ^7** or **^8**, **ioredis ^5**.

- If you depend on ioredis 4, please use [version 7](https://github.com/liaoliaots/nestjs-redis/tree/v7.0.0) of the lib.

### Installation

```sh
# with npm
npm install --save @liaoliaots/nestjs-redis ioredis
# with yarn
yarn add @liaoliaots/nestjs-redis ioredis
```

## Usage

- [Redis](docs/latest/redis.md)
  - [Usage](docs/latest/redis.md)
  - [Configuration](docs/latest/redis.md#configuration)
  - [Testing](docs/latest/redis.md#testing)
  - [Non-Global](docs/latest/redis.md#non-global)
  - [Unix domain socket](docs/latest/redis.md#unix-domain-socket)
- [Cluster](docs/latest/cluster.md)
  - [Usage](docs/latest/cluster.md)
  - [Configuration](docs/latest/cluster.md#configuration)
  - [Testing](docs/latest/cluster.md#testing)
  - [Non-Global](docs/latest/cluster.md#non-global)
- [Health Checks](docs/latest/health-checks.md)
  - [Usage](docs/latest/health-checks.md)
  - [Settings](docs/latest/health-checks.md#settings)
- [Examples](docs/latest/examples.md)
  - [High availability with Redis Sentinel](docs/latest/examples.md#sentinel)

### Legacy

- version 5, [click here](docs/v5)
- version 6, [click here](docs/v6)
- version 7, [click here](docs/v7)

## Roadmap

- [ ] Compatible with **NestJS ^9**

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

- [Full-featured Redis client - ioredis](https://github.com/luin/ioredis)
- [Redis documentation](https://redis.io/)
- [Redis docker image](https://hub.docker.com/_/redis)

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
