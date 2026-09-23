import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Department } from './department.model.js';
//A model Describes the table to TypeScript/Sequelize
// This file is a model. It only tells Sequelize: "When my code says User.findAll(), translate it to SQL against the users table."
// It never runs any CREATE TABLE.
@Table({
  tableName: 'users',
  underscored: true,
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM('admin', 'employee'),
    allowNull: false,
    defaultValue: 'employee',
  })
  declare role: 'admin' | 'employee';

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'department_id',
  })
  declare departmentId: number;

  @BelongsTo(() => Department, { foreignKey: 'department_id', as: 'department' })
  declare department?: any;
}