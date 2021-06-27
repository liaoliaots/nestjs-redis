import { Controller, Get } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { InjectCluster } from '../../../../lib';

@Controller('inject')
export class InjectController {
    constructor(
        @InjectCluster('client0') private readonly client0: Cluster,
        @InjectCluster() private readonly clientDefault: Cluster
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
