import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
    ){}



    findAll() : Promise<Task[]> {
        return this.taskRepo.find({ order: {id: 'DESC'}});
    }


    async create(dto: CreateTaskDto): Promise<Task> {
        const task = this.taskRepo.create({
            title: dto.title,
            completed: false,
        });

        return this.taskRepo.save(task);
    }
}