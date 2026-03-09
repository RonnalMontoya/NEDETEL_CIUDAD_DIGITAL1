import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '../prisma.service';

type OrderItemWithProduct = {
  id: number;
  quantity: number;
  unitPrice: string;
  product: {
    id: number;
    name: string;
    sku: string;
  };
};

@Injectable()
export class OrderDataLoaderService {
  constructor(private readonly prisma: PrismaService) {}

  createOrderItemsLoader(): DataLoader<number, OrderItemWithProduct[]> {
    return new DataLoader<number, OrderItemWithProduct[]>(async orderIds => {
      const rows = await this.prisma.orderItem.findMany({
        where: { orderId: { in: [...orderIds] } },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      });

      const grouped = new Map<number, OrderItemWithProduct[]>();
      for (const id of orderIds) {
        grouped.set(id, []);
      }

      for (const row of rows) {
        grouped.get(row.orderId)?.push({
          id: row.id,
          quantity: row.quantity,
          unitPrice: row.unitPrice.toString(),
          product: {
            id: row.product.id,
            name: row.product.name,
            sku: row.product.sku,
          },
        });
      }

      return orderIds.map(id => grouped.get(id) ?? []);
    });
  }
}
