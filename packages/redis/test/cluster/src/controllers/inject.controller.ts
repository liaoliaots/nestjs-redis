import { Controller, Get } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { InjectCluster } from '@/.';

@Controller('inject')
export class InjectController {
  constructor(
    @InjectCluster() private readonly client0: Cluster,
    @InjectCluster('client1') private readonly client1: Cluster
  ) {}

  @Get()
  async ping() {
    const resp_0 = await this.client0.ping();
    const resp_1 = await this.client1.ping();
    return [resp_0, resp_1];
  }
}
