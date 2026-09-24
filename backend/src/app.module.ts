import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from './models/department.model.js';
import { User } from './models/user.model.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { Project } from './models/project.model.js';
import { ProjectMember } from './models/project-member.model.js';
import { ProjectsModule } from './projects/projects.module.js';
import { Task } from './models/task.model.js';
import { Comment } from './models/comment.model.js';
import { TasksModule } from './tasks/tasks.module.js';
import { Shift } from './models/shift.model.js';
import { ShiftsModule } from './shifts/shifts.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        uri: config.get<string>('DATABASE_URL'),
        models: [Department, User, Project, ProjectMember, Task, Comment,Shift],
        autoLoadModels: true,
        synchronize: false,
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
        retry: {
          match: [/Connection terminated unexpectedly/],
          max: 3,
        },
      }),
    }),

    // this tells, makes the User model injectable in this module
    SequelizeModule.forFeature([User]),
    AuthModule,
    ProjectsModule,
    TasksModule,
    ShiftsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}