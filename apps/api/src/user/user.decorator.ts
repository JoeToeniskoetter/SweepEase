import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'ws') {
      return ctx.switchToWs().getData().user;
    }
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
