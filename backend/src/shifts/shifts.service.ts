import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Shift } from '../models/shift.model.js';

@Injectable()
export class ShiftsService {
  constructor(@InjectModel(Shift) private readonly shiftModel: typeof Shift) {}

  async clockIn(userId: number) {
    const active = await this.shiftModel.findOne({
      where: { userId, clockOut: null },
    }as any);
    if (active) throw new BadRequestException('You are already clocked in');

    return this.shiftModel.create({
      userId,
      clockIn: new Date(),
    }as any);
  }

  async clockOut(userId: number) {
    const active = await this.shiftModel.findOne({
      where: { userId, clockOut: null },
    }as any);
    if (!active) throw new BadRequestException('You are not clocked in');

    active.clockOut = new Date();
    await active.save();

    const hours = (active.clockOut.getTime() - active.clockIn.getTime()) / 3600000;
    return {
      id: active.id,
      clockIn: active.clockIn,
      clockOut: active.clockOut,
      totalHours: Number(hours.toFixed(2)),
    };
  }

  async myShifts(userId: number) {
    return this.shiftModel.findAll({
      where: { userId },
      order: [['clockIn', 'DESC']],
    });
  }

  async activeShift(userId: number) {
    const shift = await this.shiftModel.findOne({
      where: { userId, clockOut: null },
    }as any);
    if (!shift) throw new NotFoundException('No active shift');
    return shift;
  }
}