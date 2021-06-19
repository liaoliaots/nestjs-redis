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
    async pingClient0(): Promise<string> {
        return await this.redisClient0.ping();
    }

    @Get('default')
    async pingDefault(): Promise<string> {
        return await this.redisDefault.ping();
    }
}
