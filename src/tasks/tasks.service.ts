import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { UpdateTaskStatusDTO } from "./dto/update-task-status.dto";
import { GetTaskFilterDTO } from "./dto/get-task-filter.dto";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    getTasks(filterDTO: GetTaskFilterDTO): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDTO);
    }

    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne(id);

        if (!task) {
            throw new NotFoundException();
        }

        return task;
    }

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO);
    }

    async updateTaskStatus(id: number, updateTaskStatus: UpdateTaskStatusDTO): Promise<Task> {
        const task = await this.getTaskById(id);

        task.status = updateTaskStatus.status;
        return await task.save();
    }
}
