import { Controller ,Get  ,Post , Body} from "@nestjs/common";
import { TaskService } from "./task.service";
import  { Task } from './task.entity';
import { CreateTaskDto } from "./dto/create-task.dto";

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get()
    getTasks(): Promise<Task[]> {
        return this.taskService.findAll();
    }

    @Post()
    createTask(@Body() dto: CreateTaskDto): Promise<Task> {
        return this.taskService.create(dto);
    }
}