import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { parseInclude, parsePagination, type CatalogQuery } from './dto/catalog-query.dto';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post('seed')
  async seedData() {
    return this.performanceService.seedDemoData();
  }

  @Get('catalog/categories')
  async getCategories(@Query() query: CatalogQuery) {
    return this.performanceService.getCategories(this.safePagination(query));
  }

  @Get('catalog/products')
  async getProducts(@Query() query: CatalogQuery) {
    const include = this.safeInclude(query.include);
    return this.performanceService.getProducts(
      this.safePagination(query),
      include.has('category'),
    );
  }

  @Post('catalog/products')
  async createProduct(
    @Body()
    body: {
      name?: string;
      sku?: string;
      price?: number;
      categoryId?: number;
    },
  ) {
    if (!body.categoryId) {
      throw new BadRequestException('categoryId es obligatorio');
    }

    return this.performanceService.createProduct({
      name: body.name ?? '',
      sku: body.sku ?? '',
      price: Number(body.price),
      categoryId: Number(body.categoryId),
    });
  }

  @Get('orders/naive')
  async getOrdersNaive(@Query() query: CatalogQuery) {
    const include = this.safeInclude(query.include);
    return this.performanceService.getOrdersNaive(
      this.safePagination(query),
      include.has('items') || include.has('items.product'),
    );
  }

  @Get('orders/batched')
  async getOrdersBatched(@Query() query: CatalogQuery) {
    const include = this.safeInclude(query.include);
    return this.performanceService.getOrdersBatched(
      this.safePagination(query),
      include.has('items') || include.has('items.product'),
    );
  }

  @Post('jobs/reports')
  async enqueueReport(
    @Body()
    body: {
      type?: 'catalog-report' | 'orders-report';
      requestedBy?: string;
    },
  ) {
    if (!body.type || !['catalog-report', 'orders-report'].includes(body.type)) {
      throw new BadRequestException('type debe ser catalog-report u orders-report');
    }

    return this.performanceService.enqueueReport(
      body.type,
      body.requestedBy ?? 'anonymous',
    );
  }

  @Get('jobs/:id')
  async getJob(@Param('id') id: string) {
    return this.performanceService.getReportJob(id);
  }

  private safePagination(query: CatalogQuery): { limit: number; offset: number } {
    try {
      return parsePagination(query);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Parametros invalidos';
      throw new BadRequestException(message);
    }
  }

  private safeInclude(raw?: string) {
    try {
      return parseInclude(raw);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'include invalido';
      throw new BadRequestException(message);
    }
  }
}
