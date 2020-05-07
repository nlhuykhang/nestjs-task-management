import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";

describe("UserRepository", () => {
    let userRepository;

    beforeEach(() => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe("signUp", () => {
        
    });
});
