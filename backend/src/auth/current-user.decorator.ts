import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//this is our custom decorator like @CurrentUser
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
//What this does, in plain words
// createParamDecorator lets us make our own decorator like @Body() or @Query()

// When you write @CurrentUser() user in a controller, it grabs request.user (set by the guard) and passes it in

// That's it — nothing else.