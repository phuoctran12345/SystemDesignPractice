import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductModule } from '../products/product.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [HttpModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

