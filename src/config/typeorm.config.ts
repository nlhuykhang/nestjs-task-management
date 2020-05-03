import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123qwe",
    database: "taskmanagement",
    entities: ['../**/*.entity.{js,ts}'],
    synchronize: true,
};
