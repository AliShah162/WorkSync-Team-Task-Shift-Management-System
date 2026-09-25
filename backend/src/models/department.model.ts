import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from './user.model.js';

@Table({
    // The migration created the actual table. The @Table decorator just labels the class so Sequelize knows which table to talk to.
  tableName: 'departments',
  underscored: true,
  timestamps: true,
})
export class Department extends Model<Department> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;//The declare keyword lets you satisfy TypeScript without breaking Sequelize's runtime behavior.

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @HasMany(() => User, { foreignKey: 'department_id', as: 'users' })
  declare users?: any[];
}
//@HasMany line tells Sequelize: "One Department has many Users." It's the model-level way of describing the foreign key relationship that already exists in the database.