import { Injectable } from '@nestjs/common';
import { User } from './user.types';

@Injectable() // khởi tạo table User
export class UserService {
  private readonly users: User[] = [
    { id: 1, name: 'Nguyễn Minh Anh' },
    { id: 2, name: 'Trần Quốc Huy' },
    { id: 3, name: 'Lê Thảo Nguyên' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }
}

 