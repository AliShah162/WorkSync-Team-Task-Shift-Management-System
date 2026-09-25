import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { Task } from '../models/task.model.js';
import { Project } from '../models/project.model.js';
import { Shift } from '../models/shift.model.js';

@Module({
  imports: [SequelizeModule.forFeature([Task, Project, Shift])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}