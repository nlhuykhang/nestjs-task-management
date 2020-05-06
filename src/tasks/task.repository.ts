import { Task } from "./task.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTaskFilterDTO } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { User } from "../auth/user.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger("TaskRepository");

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        const task = new Task();

        task.status = TaskStatus.OPEN;
        task.title = createTaskDTO.title;
        task.description = createTaskDTO.description;
        task.user = user;
        await task.save();

        delete task.user;
        return task;
    }

    async getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]> {
        const { status, search } = filterDTO;
        const query = this.createQueryBuilder("task");

        query.where("task.userId = :userId", {
            userId: user.id,
        });

        if (status) {
            query.andWhere("task.status = :status", {
                status
            });
        }

        if (search) {
            query.andWhere("task.title LIKE :search or task.description LIKE :search", {
                search: `%${search}%`
            });
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (e) {
            this.logger.error(`Failed to get tasks for user ${user.username}`, e.stack);
            throw new InternalServerErrorException();
        }

    }
}
