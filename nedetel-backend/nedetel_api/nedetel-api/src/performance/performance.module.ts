import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { QueryCacheService } from './query-cache.service';
import { OrderDataLoaderService } from './order-dataloader.service';
import { JobsQueueService } from './jobs-queue.service';

@Module({
  controllers: [PerformanceController],
  providers: [
    PrismaService,
    PerformanceService,
    QueryCacheService,
    OrderDataLoaderService,
    JobsQueueService,
  ],
})
export class PerformanceModule {}
