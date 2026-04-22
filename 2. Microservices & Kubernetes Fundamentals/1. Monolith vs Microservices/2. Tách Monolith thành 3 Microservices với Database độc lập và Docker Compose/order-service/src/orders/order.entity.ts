import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'int' })
  productId!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'varchar', length: 24, default: 'PENDING' })
  status!: OrderStatus;

  @CreateDateColumn()
  createdAt!: Date;
}

