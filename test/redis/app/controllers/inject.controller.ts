import { Controller, Get } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@/index';

@Controller('inject')
export class InjectController {
    constructor(
        @InjectRedis('client0') private readonly client0: Redis,
        @InjectRedis() private readonly clientDefault: Redis
    ) {}

    @Get('client0')
    pingClient0(): Promise<string> {
        return this.client0.ping();
    }

    @Get('default')
    pingDefault(): Promise<string> {
        return this.clientDefault.ping();
    }
}
