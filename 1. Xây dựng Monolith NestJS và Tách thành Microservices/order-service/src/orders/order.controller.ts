import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { Order } from './order.types';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(body.userId, body.productId);
  }

  @Get()
  findAll(): Order[] {
    return this.orderService.findAll();
  }
}

