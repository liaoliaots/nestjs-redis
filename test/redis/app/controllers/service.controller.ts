import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../../../../lib';
import { CLIENT_0 } from '../app.module';

@Controller('service')
export class ServiceController {
    constructor(private readonly redisService: RedisService) {}

    @Get('client0')
    async pingClient0(): Promise<string> {
        return await this.redisService.getClient(CLIENT_0).ping();
    }

    @Get('default')
    async pingDefault(): Promise<string> {
        return await this.redisService.getClient().ping();
    }
}
