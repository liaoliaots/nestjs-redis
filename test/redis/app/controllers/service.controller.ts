import { Controller, Get } from '@nestjs/common';
import { RedisService } from '@/.';

@Controller('service')
export class ServiceController {
    constructor(private readonly redisService: RedisService) {}

    @Get('clientDefault')
    async pingClientDefault(): Promise<string> {
        return await this.redisService.getClient().ping();
    }

    @Get('client1')
    async pingClient1(): Promise<string> {
        return await this.redisService.getClient('client1').ping();
    }
}
