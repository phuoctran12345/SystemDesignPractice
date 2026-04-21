import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ProductService } from '../products/product.service';
import { Order } from './order.types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  private readonly orders: Order[] = [];
  private nextId = 1;

  constructor(
    private readonly httpService: HttpService,
    private readonly productService: ProductService,
  ) {}

  async createOrder(userId: number, productId: number): Promise<Order> {
    await this.assertUserExists(userId);

    const product = this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    const order: Order = {
      id: this.nextId++,
      userId,
      productId,
      createdAt: new Date().toISOString(),
    };

    this.orders.push(order);
    return order;
  }

  findAll(): Order[] {
    return this.orders;
  }

  private async assertUserExists(userId: number): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.get(`http://localhost:3001/users/${userId}`),
      );
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        throw new NotFoundException(`User ${userId} not found`);
      }
      throw err;
    }
  }
}

