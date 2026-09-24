import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { Task } from '../models/task.model.js';
import { Comment } from '../models/comment.model.js';
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/project-member.model.js';
import { User } from '../models/user.model.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Task, Comment, Project, ProjectMember, User]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}