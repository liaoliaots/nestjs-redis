import { Injectable } from '@nestjs/common';
import { RedisOptionsFactory, RedisModuleOptions } from '@/.';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  createRedisOptions(): RedisModuleOptions {
    return {
      commonOptions: {
        host: '127.0.0.1'
      },
      config: [{ port: 6380 }, { namespace: 'client1', port: 6381 }]
    };
  }
}
