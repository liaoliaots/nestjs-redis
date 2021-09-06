import { Controller, Get } from '@nestjs/common';
import { ClusterService } from '@/.';

@Controller('service')
export class ServiceController {
    constructor(private readonly clusterService: ClusterService) {}

    @Get('clientDefault')
    async pingClientDefault(): Promise<string> {
        return await this.clusterService.getClient().ping();
    }

    @Get('client1')
    async pingClient1(): Promise<string> {
        return await this.clusterService.getClient('client1').ping();
    }
}
