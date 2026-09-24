// jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();//When your class extends another class, and you define your own constructor, you must call super() before using this. It says: "run the parent's constructor first, so the parent can set itself up.
  }
}