import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProductEntity> {
    const product = await this.productService.findById(Number(id));
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  @Post()
  create(@Body() dto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(dto);
  }
}

