import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { UpdateTaskStatusDTO } from "./dto/update-task-status.dto";
import { GetTaskFilterDTO } from "./dto/get-task-filter.dto";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";
import { User } from "../auth/user.entity";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDTO, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: {
                id,
                userId: user.id,
            }
        });

        if (!task) {
            throw new NotFoundException();
        }

        return task;
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({
            id,
            userId: user.id
        });

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, user);
    }

    async updateTaskStatus(id: number, updateTaskStatus: UpdateTaskStatusDTO, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = updateTaskStatus.status;
        return await task.save();
    }
}
