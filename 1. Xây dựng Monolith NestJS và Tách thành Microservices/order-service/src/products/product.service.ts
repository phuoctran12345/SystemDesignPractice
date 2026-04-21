import { Injectable } from '@nestjs/common';
import { Product } from './product.types';

@Injectable()
export class ProductService {
  private readonly products: Product[] = [
    { id: 101, name: 'Bình giữ nhiệt Inox 500ml', price: 189000 },
    { id: 102, name: 'Sổ tay giấy kraft A5', price: 59000 },
    { id: 103, name: 'Bút gel nét mảnh 0.5mm', price: 25000 },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}

