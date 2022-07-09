import { Controller, Get } from '@nestjs/common';
import { RedisService } from '@/.';

@Controller('manager')
export class ManagerController {
    constructor(private readonly redisManager: RedisService) {}

    @Get()
    async pingDefault(): Promise<string> {
        return await this.redisManager.getClient().ping();
    }

    @Get('client1')
    async pingClient1(): Promise<string> {
        return await this.redisManager.getClient('client1').ping();
    }
}
