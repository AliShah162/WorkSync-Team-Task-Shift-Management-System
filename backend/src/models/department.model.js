var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from './user.model.js';
let Department = class Department extends Model {
};
__decorate([
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Department.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Department.prototype, "name", void 0);
__decorate([
    HasMany(() => User, { foreignKey: 'department_id', as: 'users' }),
    __metadata("design:type", Array)
], Department.prototype, "users", void 0);
Department = __decorate([
    Table({
        tableName: 'departments',
        underscored: true,
        timestamps: true,
    })
], Department);
export { Department };
//# sourceMappingURL=department.model.js.map