import { Injectable } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";
import * as uuid from "uuid/v1";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { UpdateTaskStatusDTO } from "./dto/update-task-status.dto";
import { GetTaskFilterDTO } from "./dto/get-task-filter.dto";

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilter(filterDTO: GetTaskFilterDTO): Task[] {
        const { status, search } = filterDTO;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) ||
                task.description.includes(search));
        }

        return tasks;
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

    updateTaskStatus(id: string, updateTaskStatus: UpdateTaskStatusDTO): Task {
        const task = this.getTaskById(id);

        if (!task) {
            return null;
        }

        task.status = updateTaskStatus.status;
        return task;
    }
}
