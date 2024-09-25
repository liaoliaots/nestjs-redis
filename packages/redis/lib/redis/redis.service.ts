import { Injectable, Inject } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENTS, DEFAULT_REDIS } from './redis.constants';
import { RedisClients } from './interfaces';
import { parseNamespace } from '@/utils';
import { Namespace } from '@/interfaces';
import { ClientNotFoundError } from '@/errors';

/**
 * Manager for redis connections.
 */
@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENTS) private readonly clients: RedisClients) {}

  /**
   * Retrieves a redis connection by namespace.
   * However, if the query does not find a connection, it returns ClientNotFoundError: No Connection found error.
   *
   * @param namespace - The namespace
   * @returns A redis connection
   */
  getOrThrow(namespace: Namespace = DEFAULT_REDIS): Redis {
    const client = this.clients.get(namespace);
    if (!client) throw new ClientNotFoundError(parseNamespace(namespace));
    return client;
  }

  /**
   * Retrieves a redis connection by namespace, if the query does not find a connection, it returns `null`;
   *
   * @param namespace - The namespace
   * @returns A redis connection or nil
   */
  getOrNil(namespace: Namespace = DEFAULT_REDIS): Redis | null {
    const client = this.clients.get(namespace);
    if (!client) return null;
    return client;
  }
}
