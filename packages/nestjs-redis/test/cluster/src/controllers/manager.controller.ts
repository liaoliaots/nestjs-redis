import { Controller, Get } from '@nestjs/common';
import { ClusterService } from '@/.';

@Controller('manager')
export class ManagerController {
    constructor(private readonly clusterManager: ClusterService) {}

    @Get()
    async pingDefault(): Promise<string> {
        return await this.clusterManager.getClient().ping();
    }

    @Get('client1')
    async pingClient1(): Promise<string> {
        return await this.clusterManager.getClient('client1').ping();
    }
}
