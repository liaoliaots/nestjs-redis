import { Controller, Get } from '@nestjs/common';
import { ClusterService } from '../../../../lib';

@Controller('service')
export class ServiceController {
    constructor(private readonly clusterService: ClusterService) {}

    @Get('client0')
    pingClient0(): Promise<string> {
        return this.clusterService.getClient('client0').ping();
    }

    @Get('default')
    pingDefault(): Promise<string> {
        return this.clusterService.getClient().ping();
    }
}
