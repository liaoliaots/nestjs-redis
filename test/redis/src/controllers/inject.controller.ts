import { Controller, Get } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@/.';

@Controller('inject')
export class InjectController {
    constructor(
        @InjectRedis() private readonly defaultClient: Redis,
        @InjectRedis('client1') private readonly client1: Redis
    ) {}

    @Get()
    async pingDefault(): Promise<string> {
        return await this.defaultClient.ping();
    }

    @Get('client1')
    async pingClient1(): Promise<string> {
        return await this.client1.ping();
    }
}
