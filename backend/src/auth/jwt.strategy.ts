import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    }as any);
  }

  async validate(payload: { sub: number; role: string }) {
    const user = await this.userModel.findByPk(payload.sub, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Whatever we return here becomes req.user
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}