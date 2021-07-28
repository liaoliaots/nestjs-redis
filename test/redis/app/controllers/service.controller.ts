import { Controller, Get } from '@nestjs/common';
import { RedisService } from '@/index';

@Controller('service')
export class ServiceController {
    constructor(private readonly redisService: RedisService) {}

    @Get('client0')
    pingClient0(): Promise<string> {
        return this.redisService.getClient('client0').ping();
    }

    @Get('default')
    pingDefault(): Promise<string> {
        return this.redisService.getClient().ping();
    }
}
