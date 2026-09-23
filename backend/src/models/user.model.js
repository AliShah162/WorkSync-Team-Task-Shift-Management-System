var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BelongsTo, Column, DataType, ForeignKey, Model, Table, } from 'sequelize-typescript';
import { Department } from './department.model.js';
let User = class User extends Model {
};
__decorate([
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Column({
        type: DataType.STRING(150),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({
        type: DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({
        type: DataType.ENUM('admin', 'employee'),
        allowNull: false,
        defaultValue: 'employee',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    ForeignKey(() => Department),
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'department_id',
    }),
    __metadata("design:type", Number)
], User.prototype, "departmentId", void 0);
__decorate([
    BelongsTo(() => Department, { foreignKey: 'department_id', as: 'department' }),
    __metadata("design:type", Department)
], User.prototype, "department", void 0);
User = __decorate([
    Table({
        tableName: 'users',
        underscored: true,
        timestamps: true,
    })
], User);
export { User };
//# sourceMappingURL=user.model.js.map