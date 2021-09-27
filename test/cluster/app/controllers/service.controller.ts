import { Controller, Get } from '@nestjs/common';
import { ClusterManager } from '@/.';

@Controller('service')
export class ServiceController {
    constructor(private readonly clusterManager: ClusterManager) {}

    @Get('clientDefault')
    async pingClientDefault(): Promise<string> {
        return await this.clusterManager.getClient().ping();
    }

    @Get('client1')
    async pingClient1(): Promise<string> {
        return await this.clusterManager.getClient('client1').ping();
    }
}
