import { Request } from "express";

export interface IRequestWithUser extends Request {
  user: { [key: string]: string };
}

export function assertIRequestWithUser(
  req: Request | IRequestWithUser
): asserts req is IRequestWithUser {
  if (!req?.user) throw new Error("Request was not an RequestWithUser");
}
