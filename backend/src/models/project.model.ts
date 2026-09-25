import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model.js';                     
import { ProjectMember } from './project-member.model.js';

@Table({ tableName: 'projects', underscored: true, timestamps: true })
export class Project extends Model<Project> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string;

  @Column({
    type: DataType.ENUM('active', 'archived'),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: 'active' | 'archived';

  @Column({ type: DataType.DATE, allowNull: true })
  declare deadline?: Date;

  @ForeignKey(() => User)                                     
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'created_by' })
  declare createdBy: number;

  @BelongsTo(() => User, {                                   
    foreignKey: 'created_by',
    as: 'creator',
  })
  declare creator?: User;

  @BelongsToMany(
    () => User,                                             
    () => ProjectMember,                                     
    'project_id',
    'user_id',
  )
  declare members?: User[];
}