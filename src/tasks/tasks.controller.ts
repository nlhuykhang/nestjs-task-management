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


@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDTO: GetTaskFilterDTO): Promise<Task[]> {
        return this.tasksService.getTasks(filterDTO);
    }

    @Get("/:id")
    getTaskById(@Param("id", ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
        return this.tasksService.createTask(createTaskDTO);
    }

    @Delete("/:id")
    deleteTaskById(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id", ParseIntPipe) id: number,
        @Body(TaskStatusValidationPipe) updateTaskStatusDTO: UpdateTaskStatusDTO
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, updateTaskStatusDTO);
    }
}
