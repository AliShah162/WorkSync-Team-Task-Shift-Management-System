import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model.js';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async getDatabaseHealth() {
    const count = await this.userModel.count();//simply count the users in our User model!
    return {
      database: 'connected',
      userCount: count,
    };
  }
}