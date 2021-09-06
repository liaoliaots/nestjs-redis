import { Controller, Get } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@/.';

@Controller('inject')
export class InjectController {
    constructor(
        @InjectRedis() private readonly clientDefault: Redis,
        @InjectRedis('client1') private readonly client1: Redis
    ) {}

    @Get('clientDefault')
    async pingClientDefault(): Promise<string> {
        return await this.clientDefault.ping();
    }

    @Get('client1')
    async pingClient1(): Promise<string> {
        return await this.client1.ping();
    }
}
