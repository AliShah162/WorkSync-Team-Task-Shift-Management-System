import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Task } from '../models/task.model.js';
import { Project } from '../models/project.model.js';
import { Shift } from '../models/shift.model.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(Project) private readonly projectModel: typeof Project,
    @InjectModel(Shift) private readonly shiftModel: typeof Shift,
  ) {}

  async stats(userId: number) {
    const completedTasks = await this.taskModel.count({
      where: { status: 'COMPLETED' },
    });

    const activeProjects = await this.projectModel.count({
      where: { status: 'active' },
    });

    // last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);//means the last 7 days

    const shifts = await this.shiftModel.findAll({
      where: {
        userId,
        clockIn: { [Op.gte]: weekAgo },
        clockOut: { [Op.ne]: null },
      },
    }as any);

    let weeklyHours = 0;
    for (const s of shifts) {
      weeklyHours += (s.clockOut!.getTime() - s.clockIn.getTime()) / 3600000;
    }

    const recentTasks = await this.taskModel.findAll({
      order: [['updatedAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'status', 'updatedAt'],
    });
//methods we made, return them.
    return {
      completedTasks,
      activeProjects,
      weeklyHours: Number(weeklyHours.toFixed(2)),
      recentActivity: recentTasks,
    };
  }
}