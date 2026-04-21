import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateOrderDto): Promise<OrderEntity> {
    return this.orderService.createOrder(body.userId, body.productId, body.quantity);
  }

  @Get()
  findAll(): Promise<OrderEntity[]> {
    return this.orderService.findAll();
  }
}

