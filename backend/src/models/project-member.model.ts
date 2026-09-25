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
  //this column is a foreign key pointing to another table." It's the link between two models at the code level, so Sequelize knows the relationship exists.
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'project_id' })
  declare projectId: number;
  //so we said make this column the foriegn key of project.model

  @ForeignKey(() => require('./user.model.js').User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  declare userId: number;
}