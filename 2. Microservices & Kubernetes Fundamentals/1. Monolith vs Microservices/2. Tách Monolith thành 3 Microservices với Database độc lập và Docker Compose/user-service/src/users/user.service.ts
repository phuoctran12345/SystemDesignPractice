import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepo.find({ order: { id: 'ASC' } });
  }

  findById(id: number): Promise<UserEntity | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
    });
    return await this.usersRepo.save(user);
  }
}

 