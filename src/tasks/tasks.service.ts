import { Injectable } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";
import * as uuid from "uuid/v1";
import { CreateTaskDTO } from "./dto/create-task.dto";

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    deleteTaskById(id: string): boolean {
        const i = this.tasks.findIndex(task => task.id === id);

        if (i === -1) {
            return false;
        }

        this.tasks.splice(i, 1);
        return true;
    }

    createTask(createTaskDTO: CreateTaskDTO): Task {
        const {
            title,
            description
        } = createTaskDTO;

        const task: Task = {
            title,
            description,
            status: TaskStatus.OPEN,
            id: uuid(),
        };

        this.tasks.push(task);
        return task;
    }
}
