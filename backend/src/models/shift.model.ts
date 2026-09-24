import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model.js';

@Table({ tableName: 'shifts', underscored: true, timestamps: true })
export class Shift extends Model<Shift> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  declare userId: number;

  @Column({ type: DataType.DATE, allowNull: false, field: 'clock_in' })
  declare clockIn: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'clock_out' })
  declare clockOut?: Date;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    as: 'user',
  })
  declare user?: User;
}