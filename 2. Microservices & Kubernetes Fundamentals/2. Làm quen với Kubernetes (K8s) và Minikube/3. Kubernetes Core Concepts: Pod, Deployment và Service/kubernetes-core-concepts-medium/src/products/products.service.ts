import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  private readonly cacheKeyAll = 'products:all';

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) {}

  async findAll(): Promise<Product[]> {
    const cached = await this.redisService.get(this.cacheKeyAll);
    if (cached) {
      return JSON.parse(cached) as Product[];
    }

    const products = await this.productRepository.find({
      order: { createdAt: 'DESC' },
    });

    await this.redisService.set(this.cacheKeyAll, JSON.stringify(products), 60);
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      name: dto.name,
      price: String(dto.price),
      description: dto.description,
    });

    const saved = await this.productRepository.save(product);
    await this.redisService.del(this.cacheKeyAll);
    return saved;
  }
}

