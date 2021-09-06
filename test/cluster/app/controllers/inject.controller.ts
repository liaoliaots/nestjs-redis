import { Controller, Get } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { InjectCluster } from '@/.';

@Controller('inject')
export class InjectController {
    constructor(
        @InjectCluster() private readonly clientDefault: Cluster,
        @InjectCluster('client1') private readonly client1: Cluster
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
