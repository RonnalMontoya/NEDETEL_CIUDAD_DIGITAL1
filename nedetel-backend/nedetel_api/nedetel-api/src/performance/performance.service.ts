import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { OrderDataLoaderService } from './order-dataloader.service';
import { QueryCacheService } from './query-cache.service';
import { JobsQueueService } from './jobs-queue.service';

type Pagination = {
  limit: number;
  offset: number;
};

@Injectable()
export class PerformanceService {
  private readonly cacheTtlMs = Number(process.env.PERF_CACHE_TTL_MS ?? 45_000);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: QueryCacheService,
    private readonly orderDataLoader: OrderDataLoaderService,
    private readonly jobsQueue: JobsQueueService,
  ) {}

  async getCategories(query: Pagination): Promise<Record<string, unknown>> {
    const key = `categories:${query.limit}:${query.offset}`;
    const started = Date.now();

    const response = await this.cache.getOrSet(key, this.cacheTtlMs, async () => {
      const [items, total] = await Promise.all([
        this.prisma.category.findMany({
          take: query.limit,
          skip: query.offset,
          orderBy: { id: 'asc' },
        }),
        this.prisma.category.count(),
      ]);

      return {
        data: items,
        total,
      };
    });

    return {
      ...response.value,
      meta: {
        cacheHit: response.cacheHit,
        tookMs: Date.now() - started,
      },
    };
  }

  async getProducts(query: Pagination, includeCategory: boolean): Promise<Record<string, unknown>> {
    const key = `products:${query.limit}:${query.offset}:category=${includeCategory}`;
    const started = Date.now();

    const response = await this.cache.getOrSet(key, this.cacheTtlMs, async () => {
      const [items, total] = await Promise.all([
        this.prisma.product.findMany({
          take: query.limit,
          skip: query.offset,
          orderBy: { id: 'asc' },
          include: includeCategory
            ? {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              }
            : undefined,
        }),
        this.prisma.product.count(),
      ]);

      return {
        data: items.map(item => ({
          ...item,
          price: item.price.toString(),
        })),
        total,
      };
    });

    return {
      ...response.value,
      meta: {
        cacheHit: response.cacheHit,
        tookMs: Date.now() - started,
        includeCategory,
      },
    };
  }

  async createProduct(input: {
    name: string;
    sku: string;
    price: number;
    categoryId: number;
  }): Promise<Record<string, unknown>> {
    if (!input.name || !input.sku || !Number.isFinite(input.price)) {
      throw new BadRequestException('name, sku y price son obligatorios');
    }

    const exists = await this.prisma.category.findUnique({
      where: { id: input.categoryId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('categoryId no existe');
    }

    const created = await this.prisma.product.create({
      data: {
        name: input.name,
        sku: input.sku,
        price: new Prisma.Decimal(input.price),
        categoryId: input.categoryId,
      },
    });

    const invalidated = this.cache.invalidate('products:');

    return {
      data: {
        ...created,
        price: created.price.toString(),
      },
      meta: {
        invalidatedKeys: invalidated,
      },
    };
  }

  async getOrdersNaive(query: Pagination, includeItems: boolean): Promise<Record<string, unknown>> {
    const started = Date.now();

    const orders = await this.prisma.order.findMany({
      take: query.limit,
      skip: query.offset,
      orderBy: { id: 'asc' },
    });

    let queries = 1;

    if (!includeItems) {
      return {
        data: orders,
        meta: {
          strategy: 'naive',
          queryCount: queries,
          tookMs: Date.now() - started,
        },
      };
    }

    const withItems: Array<Record<string, unknown>> = [];
    for (const order of orders) {
      const items = await this.prisma.orderItem.findMany({
        where: { orderId: order.id },
        include: {
          product: {
            select: { id: true, name: true, sku: true },
          },
        },
      });
      queries += 1;

      withItems.push({
        ...order,
        orderItems: items.map(item => ({
          ...item,
          unitPrice: item.unitPrice.toString(),
        })),
      });
    }

    return {
      data: withItems,
      meta: {
        strategy: 'naive',
        queryCount: queries,
        tookMs: Date.now() - started,
      },
    };
  }

  async getOrdersBatched(query: Pagination, includeItems: boolean): Promise<Record<string, unknown>> {
    const started = Date.now();

    const orders = await this.prisma.order.findMany({
      take: query.limit,
      skip: query.offset,
      orderBy: { id: 'asc' },
    });

    if (!includeItems) {
      return {
        data: orders,
        meta: {
          strategy: 'dataloader',
          queryCount: 1,
          tookMs: Date.now() - started,
        },
      };
    }

    const loader = this.orderDataLoader.createOrderItemsLoader();
    const itemGroups = await Promise.all(orders.map(order => loader.load(order.id)));

    const data = orders.map((order, index) => ({
      ...order,
      orderItems: itemGroups[index],
    }));

    return {
      data,
      meta: {
        strategy: 'dataloader',
        queryCount: 2,
        tookMs: Date.now() - started,
      },
    };
  }

  async enqueueReport(type: 'catalog-report' | 'orders-report', requestedBy: string) {
    return this.jobsQueue.enqueueReport({ type, requestedBy });
  }

  async getReportJob(id: string) {
    return this.jobsQueue.getJobStatus(id);
  }

  async seedDemoData(): Promise<Record<string, unknown>> {
    const existingCategories = await this.prisma.category.count();
    if (existingCategories > 0) {
      return {
        message: 'Datos de demo ya existen, no se duplicaron.',
      };
    }

    const categories = await this.prisma.$transaction([
      this.prisma.category.create({
        data: { name: 'Conectividad', description: 'Servicios de internet y fibra' },
      }),
      this.prisma.category.create({
        data: { name: 'Infraestructura', description: 'Equipos y redes de transporte' },
      }),
      this.prisma.category.create({
        data: { name: 'IoT', description: 'Sensores y telemetria' },
      }),
    ]);

    const products = await this.prisma.$transaction([
      this.prisma.product.create({
        data: {
          name: 'Router Core XR-900',
          sku: 'NDT-XR-900',
          price: new Prisma.Decimal('899.90'),
          categoryId: categories[1].id,
        },
      }),
      this.prisma.product.create({
        data: {
          name: 'ONU Fibra FTTx',
          sku: 'NDT-ONU-01',
          price: new Prisma.Decimal('79.90'),
          categoryId: categories[0].id,
        },
      }),
      this.prisma.product.create({
        data: {
          name: 'Gateway IoT LTE',
          sku: 'NDT-IOT-77',
          price: new Prisma.Decimal('149.90'),
          categoryId: categories[2].id,
        },
      }),
    ]);

    const orders = await this.prisma.$transaction([
      this.prisma.order.create({
        data: { customerName: 'Empresa Andina S.A.', status: 'PENDING' },
      }),
      this.prisma.order.create({
        data: { customerName: 'Municipio Central', status: 'APPROVED' },
      }),
      this.prisma.order.create({
        data: { customerName: 'Cooperativa Amazonica', status: 'PENDING' },
      }),
    ]);

    await this.prisma.$transaction([
      this.prisma.orderItem.create({
        data: {
          orderId: orders[0].id,
          productId: products[0].id,
          quantity: 2,
          unitPrice: new Prisma.Decimal('899.90'),
        },
      }),
      this.prisma.orderItem.create({
        data: {
          orderId: orders[0].id,
          productId: products[1].id,
          quantity: 10,
          unitPrice: new Prisma.Decimal('79.90'),
        },
      }),
      this.prisma.orderItem.create({
        data: {
          orderId: orders[1].id,
          productId: products[2].id,
          quantity: 5,
          unitPrice: new Prisma.Decimal('149.90'),
        },
      }),
      this.prisma.orderItem.create({
        data: {
          orderId: orders[2].id,
          productId: products[1].id,
          quantity: 4,
          unitPrice: new Prisma.Decimal('79.90'),
        },
      }),
    ]);

    this.cache.invalidate('categories:');
    this.cache.invalidate('products:');

    return {
      message: 'Datos demo creados correctamente',
      categories: categories.length,
      products: products.length,
      orders: orders.length,
    };
  }
}
