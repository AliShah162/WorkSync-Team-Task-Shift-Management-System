import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Task } from '../models/task.model.js';
import { Comment } from '../models/comment.model.js';
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/project-member.model.js';
import { User } from '../models/user.model.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { FilterTasksDto } from './dto/filter-tasks.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(Comment) private readonly commentModel: typeof Comment,
    @InjectModel(Project) private readonly projectModel: typeof Project,
    @InjectModel(ProjectMember)
    private readonly memberModel: typeof ProjectMember,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  // helper: is user a member of this project?
  private async isMember(projectId: number, userId: number) {
    const row = await this.memberModel.findOne({
      where: { projectId, userId },
    });
    return !!row;
  }
  // we created methods here like: create, findAll, findOne,update,remove,addComment    
  async create(dto: CreateTaskDto, user: { id: number; role: string }) {
    const project = await this.projectModel.findByPk(dto.projectId);
    if (!project) throw new NotFoundException('Project not found');

    // employee must be a member
    if (user.role !== 'admin' && !(await this.isMember(project.id, user.id))) {
      throw new ForbiddenException('Not a member of this project');
    }

    if (dto.assignedUserId) {
      const u = await this.userModel.findByPk(dto.assignedUserId);
      if (!u) throw new NotFoundException('Assigned user not found');
    }

    return this.taskModel.create({
      title: dto.title,
      description: dto.description,
      projectId: dto.projectId,
      assignedUserId: dto.assignedUserId ?? null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      status: 'TODO',
    } as any);
  }

  async findAll(filter: FilterTasksDto, user: { id: number; role: string }) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (filter.status) where.status = filter.status;
    if (filter.projectId) where.projectId = filter.projectId;
    if (filter.assignedUserId) where.assignedUserId = filter.assignedUserId;

    // employees see only tasks in projects they belong to
    if (user.role !== 'admin') {
      const memberships = await this.memberModel.findAll({
        where: { userId: user.id },
        attributes: ['projectId'],
      });
      const projectIds = memberships.map((m) => m.projectId);
      where.projectId = where.projectId
        ? where.projectId
        : { [Op.in]: projectIds };
    }

    const sortBy = filter.sortBy ?? 'createdAt';
    const order = filter.order ?? 'DESC';

    const { rows, count } = await this.taskModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name', 'email'],
        },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
      order: [[sortBy, order]],
      limit,
      offset,
    });

    return {
      items: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number) {
    const task = await this.taskModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'name', 'email'],
        },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        {
          model: Comment,
          as: 'comments',
          include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
          ],
        },
      ],
      order: [[{ model: Comment, as: 'comments' }, 'createdAt', 'ASC']],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.taskModel.findByPk(id);
    if (!task) throw new NotFoundException('Task not found');

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.assignedUserId !== undefined)
      task.assignedUserId = dto.assignedUserId;
    if (dto.dueDate !== undefined) task.dueDate = new Date(dto.dueDate);

    await task.save();
    return task;
  }

  async remove(id: number) {
    const task = await this.taskModel.findByPk(id);
    if (!task) throw new NotFoundException('Task not found');
    await task.destroy();
    return { deleted: true };
  }

  async addComment(taskId: number, dto: CreateCommentDto, userId: number) {
    const task = await this.taskModel.findByPk(taskId);
    if (!task) throw new NotFoundException('Task not found');

    return this.commentModel.create({
      taskId,
      userId,
      body: dto.body,
    } as any);
  }
}
