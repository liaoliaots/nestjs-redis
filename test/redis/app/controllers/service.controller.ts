import { Controller, Get } from '@nestjs/common';
import { RedisManager } from '@/.';

@Controller('service')
export class ServiceController {
    constructor(private readonly redisManager: RedisManager) {}

    @Get('clientDefault')
    async pingClientDefault(): Promise<string> {
        return await this.redisManager.getClient().ping();
    }

    @Get('client1')
    async pingClient1(): Promise<string> {
        return await this.redisManager.getClient('client1').ping();
    }
}
