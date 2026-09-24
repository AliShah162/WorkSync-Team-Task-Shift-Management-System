import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ShiftsService } from './shifts.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('clock-in')
  clockIn(@CurrentUser() user: any) {
    return this.shiftsService.clockIn(user.id);
  }

  @Post('clock-out')
  clockOut(@CurrentUser() user: any) {
    return this.shiftsService.clockOut(user.id);
  }

  @Get('me')
  myShifts(@CurrentUser() user: any) {
    return this.shiftsService.myShifts(user.id);
  }

  @Get('active')
  active(@CurrentUser() user: any) {
    return this.shiftsService.activeShift(user.id);
  }
}