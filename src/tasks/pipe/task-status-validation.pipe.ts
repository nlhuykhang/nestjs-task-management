import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";
import { UpdateTaskStatusDTO } from "../dto/update-task-status.dto";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
    ];

    transform(value: UpdateTaskStatusDTO): UpdateTaskStatusDTO {
        if (!this.isValid(value.status)) {
            throw new BadRequestException();
        }
        return value;
    }

    private isValid(status: TaskStatus): boolean {
        return this.allowedStatus.indexOf(status) > -1;
    }
}
