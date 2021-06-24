import { Controller, Get } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { InjectClusterClient } from '../../../../lib';

@Controller('inject')
export class InjectController {
    constructor(
        @InjectClusterClient('client0') private readonly redisClient0: Cluster,
        @InjectClusterClient() private readonly redisDefault: Cluster
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
