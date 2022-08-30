import { Controller, Get } from '@nestjs/common';
import { RedisManager } from '@/.';

@Controller('manager')
export class ManagerController {
  constructor(private readonly manager: RedisManager) {}

  @Get()
  async ping() {
    const resp_0 = await this.manager.getClient().ping();
    const resp_1 = await this.manager.getClient('client1').ping();
    return [resp_0, resp_1];
  }
}
