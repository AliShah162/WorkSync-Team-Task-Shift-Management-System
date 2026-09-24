import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Project } from './project.model.js';
import { User } from './user.model.js';
import { Comment } from './comment.model.js';

@Table({ tableName: 'tasks', underscored: true, timestamps: true })
export class Task extends Model<Task> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(200), allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string;

  @Column({
    type: DataType.ENUM('TODO', 'IN_PROGRESS', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'TODO',
  })
  declare status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

  @Column({ type: DataType.DATE, allowNull: true, field: 'due_date' })
  declare dueDate?: Date;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'project_id' })
  declare projectId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true, field: 'assigned_user_id' })
  declare assignedUserId?: number;

  @BelongsTo(() => Project, {
    foreignKey: 'project_id',
    as: 'project',
  })
  declare project?: Project;

  @BelongsTo(() => User, {
    foreignKey: 'assigned_user_id',
    as: 'assignedUser',
  })
  declare assignedUser?: User;

  @HasMany(() => Comment, {
    foreignKey: 'task_id',
    as: 'comments',
  })
  declare comments?: Comment[];
}