import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { CreationAttributes } from 'sequelize';
import { User } from '../models/user.model.js';
import { Department } from '../models/department.model.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

//we create methods in service file like we created register and login
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Department)
    private readonly departmentModel: typeof Department,

    private readonly jwtService: JwtService,
  ) {}
//these are the methods
  async register(dto: RegisterDto) {
    // 1. Check email isn't already taken
    const existing = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // 2. Check the department exists
    const department = await this.departmentModel.findByPk(dto.departmentId);
    if (!department) {
      throw new BadRequestException('Department not found');
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 4. Create the user
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'employee',
      departmentId: dto.departmentId,
    } as CreationAttributes<User>);

    // 5. Return safe fields only (never the password)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }


//another method
  // login..............
  async login(dto: LoginDto) {
    //1) Find user by email
    const user = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    // 2. Compare password
    const matches = await bcrypt.compare(dto.password, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    // 3. Sign a JWT
    const payload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    // 4. Return token + safe user fields

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
//If you only returned the token, the frontend would have to make a second API call (GET /me) just to get the name and role. Returning it here saves that round-trip.
