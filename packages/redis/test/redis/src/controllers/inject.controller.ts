import { Controller, Get } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@/.';

@Controller('inject')
export class InjectController {
  constructor(
    @InjectRedis() private readonly client0: Redis,
    @InjectRedis('client1') private readonly client1: Redis
  ) {}

  @Get()
  async ping() {
    const resp_0 = await this.client0.ping();
    const resp_1 = await this.client1.ping();
    return [resp_0, resp_1];
  }
}
