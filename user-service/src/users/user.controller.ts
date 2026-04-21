import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): User {
    const user = this.userService.findById(Number(id));
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }
}