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
    ValidationPipe,
    ParseIntPipe,
    UseGuards
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { UpdateTaskStatusDTO } from "./dto/update-task-status.dto";
import { GetTaskFilterDTO } from "./dto/get-task-filter.dto";
import { TaskStatusValidationPipe } from "./pipe/task-status-validation.pipe";
import { Task } from "./task.entity";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../auth/user.entity";
import { GetUser } from "../auth/get-user.decorator";


@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDTO: GetTaskFilterDTO,
        @GetUser() user: User
    ): Promise<Task[]> {
        return this.tasksService.getTasks(filterDTO, user);
    }

    @Get("/:id")
    getTaskById(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDTO, user);
    }

    @Delete("/:id")
    deleteTaskById(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id", ParseIntPipe) id: number,
        @Body(TaskStatusValidationPipe) updateTaskStatusDTO: UpdateTaskStatusDTO,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, updateTaskStatusDTO, user);
    }
}
