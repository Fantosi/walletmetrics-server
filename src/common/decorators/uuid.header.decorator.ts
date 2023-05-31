import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";

import { isEmpty, isUUID } from "class-validator";

/**
 * @description validate "uuid" header of request
 * validate that it's valid uuid
 */
export const UuidHeader = createParamDecorator((data, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const uuid = request.headers["uuid"];

  if (isEmpty(uuid) || !isUUID(uuid)) {
    throw new BadRequestException("invalid uuid");
  }

  return String(uuid);
});
