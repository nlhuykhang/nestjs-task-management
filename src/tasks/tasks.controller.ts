import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./task.model";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { UpdateTaskStatusDTO } from "./dto/update-task-status.dto";
import { GetTaskFilterDTO } from "./dto/get-task-filter.dto";

@Controller("tasks")
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDTO: GetTaskFilterDTO): Task[] {
        if(Object.keys(filterDTO).length) {
            return this.tasksService.getTasksWithFilter(filterDTO);
        }

        return this.tasksService.getAllTasks();
    }

    @Get("/:id")
    getTaskById(@Param("id") id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
        return this.tasksService.createTask(createTaskDTO);
    }

    @Delete("/:id")
    deleteTaskById(@Param("id") id: string): boolean {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id") id: string,
        @Body() updateTaskStatusDTO: UpdateTaskStatusDTO
    ): Task {
        return this.tasksService.updateTaskStatus(id, updateTaskStatusDTO);
    }
}
