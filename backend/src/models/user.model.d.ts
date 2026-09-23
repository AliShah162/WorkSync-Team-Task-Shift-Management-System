import { Model } from 'sequelize-typescript';
import { Department } from './department.model.js';
export declare class User extends Model<User> {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'employee';
    departmentId: number;
    department?: Department;
}
