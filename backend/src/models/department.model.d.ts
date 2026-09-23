import { Model } from 'sequelize-typescript';
import { User } from './user.model.js';
export declare class Department extends Model<Department> {
    id: number;
    name: string;
    users?: User[];
}
