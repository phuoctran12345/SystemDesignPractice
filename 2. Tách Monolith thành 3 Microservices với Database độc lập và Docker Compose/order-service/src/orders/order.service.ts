import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(OrderEntity)
    private readonly ordersRepo: Repository<OrderEntity>,
  ) {}

  async createOrder(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<OrderEntity> {
    await this.assertUserExists(userId);
    await this.assertProductExists(productId);

    const order = this.ordersRepo.create({
      userId,
      productId,
      quantity,
      status: 'PENDING',
    });
    return await this.ordersRepo.save(order);
  }

  findAll(): Promise<OrderEntity[]> {
    return this.ordersRepo.find({ order: { id: 'ASC' } });
  }

  private async assertUserExists(userId: number): Promise<void> {
    const base = process.env.USER_SERVICE_URL ?? 'http://localhost:3001';
    try {
      await firstValueFrom(this.http.get(`${base}/users/${userId}`));
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) throw new NotFoundException(`User ${userId} not found`);
      throw err;
    }
  }

  private async assertProductExists(productId: number): Promise<void> {
    const base = process.env.PRODUCT_SERVICE_URL ?? 'http://localhost:3002';
    try {
      await firstValueFrom(this.http.get(`${base}/products/${productId}`));
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404)
        throw new NotFoundException(`Product ${productId} not found`);
      throw err;
    }
  }
}

