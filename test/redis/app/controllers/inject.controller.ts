import { Controller, Get } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedisClient } from '../../../../lib';
import { CLIENT_0 } from '../app.module';

@Controller('inject')
export class InjectController {
    constructor(
        @InjectRedisClient(CLIENT_0) private readonly redisClient0: Redis,
        @InjectRedisClient() private readonly redisDefault: Redis
    ) {}

    @Get('client0')
    pingClient0(): Promise<string> {
        return this.redisClient0.ping();
    }

    @Get('default')
    pingDefault(): Promise<string> {
        return this.redisDefault.ping();
    }
}
