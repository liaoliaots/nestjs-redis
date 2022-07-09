import { Controller, Get } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { InjectCluster } from '@/.';

@Controller('inject')
export class InjectController {
    constructor(
        @InjectCluster() private readonly defaultClient: Cluster,
        @InjectCluster('client1') private readonly client1: Cluster
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
