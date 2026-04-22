import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepo: Repository<ProductEntity>,
  ) {}

  findAll(): Promise<ProductEntity[]> {
    return this.productsRepo.find({ order: { id: 'ASC' } });
  }

  findById(id: number): Promise<ProductEntity | null> {
    return this.productsRepo.findOne({ where: { id } });
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const product = this.productsRepo.create({
      name: dto.name,
      price: dto.price,
      stock: dto.stock,
    });
    return await this.productsRepo.save(product);
  }
}

