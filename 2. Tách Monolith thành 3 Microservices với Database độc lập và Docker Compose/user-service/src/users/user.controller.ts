import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserEntity> {
    const user = await this.userService.findById(Number(id));
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  @Post()
  createUser(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(dto);
  }
}