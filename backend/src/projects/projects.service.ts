import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/project-member.model.js';
import { User } from '../models/user.model.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private readonly projectModel: typeof Project,
    @InjectModel(ProjectMember) private readonly memberModel: typeof ProjectMember,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}


  //these methods will be called in the controller file

  // Admin creates a project
  async create(dto: CreateProjectDto, adminId: number) {
    return this.projectModel.create({
      title: dto.title,
      description: dto.description,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
      status: 'active',
      createdBy: adminId,
    }as any);
  }

  // List projects
  // Admin → all projects
  // Employee → only projects they're a member of
  async findAll(user: { id: number; role: string }) {
    if (user.role === 'admin') {
      return this.projectModel.findAll({
        order: [['createdAt', 'DESC']],
      });
    }

    // employee: find memberships, then projects
    const memberships = await this.memberModel.findAll({
      where: { userId: user.id },
      attributes: ['projectId'],
    });
    const projectIds = memberships.map((m) => m.projectId);

    if (projectIds.length === 0) return [];

    return this.projectModel.findAll({
      where: { id: projectIds },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number) {
    const project = await this.projectModel.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.projectModel.findByPk(id);
    if (!project) throw new NotFoundException('Project not found');

    if (dto.title !== undefined) project.title = dto.title;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.deadline !== undefined) project.deadline = new Date(dto.deadline);

    await project.save();
    return project;
  }

  async archive(id: number) {
    const project = await this.projectModel.findByPk(id);
    if (!project) throw new NotFoundException('Project not found');

    project.status = 'archived';
    await project.save();
    return project;
  }

  // Admin adds a member
  async addMember(projectId: number, userId: number) {
    const project = await this.projectModel.findByPk(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const user = await this.userModel.findByPk(userId);
    if (!user) throw new BadRequestException('User not found');

    const existing = await this.memberModel.findOne({
      where: { projectId, userId },
    });
    if (existing) throw new BadRequestException('User already in project');

    return this.memberModel.create({ projectId, userId }as any);//this line will actually add the member the rest is just rules
  }

  // Admin removes a member
  async removeMember(projectId: number, userId: number) {
    const row = await this.memberModel.findOne({
      where: { projectId, userId },
    });
    if (!row) throw new NotFoundException('Membership not found');

    await row.destroy();
    return { removed: true };
  }
}