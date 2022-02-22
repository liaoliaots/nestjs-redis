import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { SharedCluster } from '../shared-cluster.module';

@Module({
    imports: [SharedCluster],
    providers: [CatsService],
    controllers: [CatsController]
})
export class CatsModule {}
