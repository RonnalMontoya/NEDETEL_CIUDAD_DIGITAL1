import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { JobStatus, Prisma } from '@prisma/client';
import { Job, Queue, Worker } from 'bullmq';
import { PrismaService } from '../prisma.service';

type ReportPayload = {
  type: 'catalog-report' | 'orders-report';
  requestedBy: string;
};

type LocalState = {
  status: JobStatus;
  result?: Record<string, unknown>;
  error?: string;
};

@Injectable()
export class JobsQueueService implements OnModuleDestroy {
  private readonly logger = new Logger(JobsQueueService.name);
  private readonly queueName = 'report-jobs';

  private queue?: Queue;
  private worker?: Worker;
  private readonly localJobs = new Map<string, LocalState>();

  constructor(private readonly prisma: PrismaService) {
    this.tryInitializeRedisQueue();
  }

  async enqueueReport(payload: ReportPayload): Promise<{ id: string; mode: string }> {
    const record = await this.prisma.reportJob.create({
      data: {
        type: payload.type,
        status: JobStatus.QUEUED,
        payload,
      },
      select: { id: true },
    });

    if (this.queue) {
      await this.queue.add(
        payload.type,
        payload,
        {
          jobId: record.id,
          attempts: 2,
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
      return { id: record.id, mode: 'bullmq' };
    }

    this.localJobs.set(record.id, { status: JobStatus.QUEUED });
    void this.processLocal(record.id, payload);
    return { id: record.id, mode: 'in-memory' };
  }

  async getJobStatus(id: string): Promise<Record<string, unknown>> {
    const job = await this.prisma.reportJob.findUnique({ where: { id } });
    if (!job) {
      return { id, status: 'NOT_FOUND' };
    }

    return {
      id: job.id,
      type: job.type,
      status: job.status,
      payload: job.payload,
      result: job.result,
      error: job.error,
      updatedAt: job.updatedAt,
    };
  }

  private tryInitializeRedisQueue(): void {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.warn('REDIS_URL no definido. Job queue trabajara en modo in-memory.');
      return;
    }

    try {
      this.queue = new Queue(this.queueName, {
        connection: {
          url: redisUrl,
          maxRetriesPerRequest: null,
        },
      });

      this.worker = new Worker(
        this.queueName,
        async (job: Job) =>
          this.processWithPersistence(job.id ?? '', job.data as ReportPayload),
        {
          connection: {
            url: redisUrl,
            maxRetriesPerRequest: null,
          },
        },
      );

      this.worker.on('failed', (job, error) => {
        if (!job?.id) {
          return;
        }
        void this.prisma.reportJob.update({
          where: { id: job.id },
          data: {
            status: JobStatus.FAILED,
            error: error.message,
          },
        });
      });
    } catch (error) {
      this.logger.error('No se pudo inicializar BullMQ, se usara cola local.', error);
      this.queue = undefined;
      this.worker = undefined;
    }
  }

  private async processWithPersistence(
    id: string,
    payload: ReportPayload,
  ): Promise<Record<string, unknown>> {
    await this.prisma.reportJob.update({
      where: { id },
      data: { status: JobStatus.PROCESSING },
    });

    try {
      const result = await this.generateHeavyReport(payload);
      await this.prisma.reportJob.update({
        where: { id },
        data: {
          status: JobStatus.COMPLETED,
          result: result as Prisma.InputJsonValue,
        },
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await this.prisma.reportJob.update({
        where: { id },
        data: {
          status: JobStatus.FAILED,
          error: message,
        },
      });
      throw error;
    }
  }

  private async processLocal(id: string, payload: ReportPayload): Promise<void> {
    await this.prisma.reportJob.update({
      where: { id },
      data: { status: JobStatus.PROCESSING },
    });

    this.localJobs.set(id, { status: JobStatus.PROCESSING });

    try {
      const result = await this.generateHeavyReport(payload);
      this.localJobs.set(id, { status: JobStatus.COMPLETED, result });

      await this.prisma.reportJob.update({
        where: { id },
        data: {
          status: JobStatus.COMPLETED,
          result: result as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.localJobs.set(id, { status: JobStatus.FAILED, error: message });
      await this.prisma.reportJob.update({
        where: { id },
        data: {
          status: JobStatus.FAILED,
          error: message,
        },
      });
    }
  }

  private async generateHeavyReport(
    payload: ReportPayload,
  ): Promise<Record<string, unknown>> {
    // Simula tarea pesada I/O + CPU fuera del request principal.
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (payload.type === 'catalog-report') {
      const [products, categories] = await Promise.all([
        this.prisma.product.count(),
        this.prisma.category.count(),
      ]);

      return {
        reportType: payload.type,
        totals: { products, categories },
        generatedAt: new Date().toISOString(),
      };
    }

    const [orders, items] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.orderItem.count(),
    ]);

    return {
      reportType: payload.type,
      totals: { orders, items },
      generatedAt: new Date().toISOString(),
    };
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
    await this.queue?.close();
  }
}
