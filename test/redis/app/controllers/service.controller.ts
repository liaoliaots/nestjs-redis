import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../../../../lib';
import { CLIENT_0 } from '../app.module';

@Controller('service')
export class ServiceController {
    constructor(private readonly redisService: RedisService) {}

    @Get('client0')
    pingClient0(): Promise<string> {
        return this.redisService.getClient(CLIENT_0).ping();
    }

    @Get('default')
    pingDefault(): Promise<string> {
        return this.redisService.getClient().ping();
    }
}
