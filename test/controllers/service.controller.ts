import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../../lib';

@Controller('service')
export class ServiceController {
    constructor(private readonly redisService: RedisService) {}

    @Get('client0')
    async pingClient0(): Promise<string> {
        return await this.redisService.getClient('client0').ping();
    }

    @Get('default')
    async pingDefault(): Promise<string> {
        return await this.redisService.getClient().ping();
    }
}
