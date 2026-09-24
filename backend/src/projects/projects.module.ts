import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/project-member.model.js';
import { User } from '../models/user.model.js';

@Module({
  imports: [SequelizeModule.forFeature([Project, ProjectMember, User])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}