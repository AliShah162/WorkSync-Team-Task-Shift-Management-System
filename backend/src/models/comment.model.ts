import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task } from './task.model.js';
import { User } from './user.model.js';

@Table({ tableName: 'comments', underscored: true, timestamps: true })
export class Comment extends Model<Comment> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare body: string;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'task_id' })
  declare taskId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  declare userId: number;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    as: 'user',
  })
  declare user?: User;
}