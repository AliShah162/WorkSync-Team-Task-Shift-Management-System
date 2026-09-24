import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'project_members', underscored: true, timestamps: true })
export class ProjectMember extends Model<ProjectMember> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => require('./project.model.js').Project)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'project_id' })
  declare projectId: number;

  @ForeignKey(() => require('./user.model.js').User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  declare userId: number;
}