import { Test } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { TaskRepository } from "./task.repository";
import { GetTaskFilterDTO } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { NotFoundException } from "@nestjs/common";

const mockedUser = {
    username: "test username",
    id: 1,
};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
});


describe("TasksService", () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TaskRepository,
                    useFactory: mockTaskRepository
                }
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe("getTasks", () => {
        it("get all tasks", async () => {

            taskRepository.getTasks.mockResolvedValue("someValue");

            const filters: GetTaskFilterDTO = {
                status: TaskStatus.OPEN,
                search: "whatever",
            };

            const result = await tasksService.getTasks(filters, mockedUser);

            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual("someValue");
        });
    });

    describe("getTaskById", () => {
        it("calls taskRepository.findOne()", async () => {
            const mockedTask = {
                title: "title",
                description: "description"
            };

            taskRepository.findOne.mockResolvedValue(mockedTask);

            const result = await tasksService.getTaskById(12, mockedUser);

            expect(mockedTask).toEqual(result);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 12,
                    userId: 1,
                }
            });
        });

        it("throw error as task is not found", async () => {
            taskRepository.findOne.mockResolvedValue(null);

            expect(tasksService.getTaskById(12, mockedUser)).rejects.toThrow(NotFoundException);
        });
    });
});
