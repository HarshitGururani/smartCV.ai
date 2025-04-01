import { AuthObject } from "@clerk/express";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
export const generateUniqueId = () => {
  const uuid = uuidv4().replace(/-/g, "");
  return `doc-${uuid.substring(0, 16)}`;
};

export const extractAuth = (req: Request): AuthObject => {
  return (req as Request & { auth: AuthObject }).auth;
};
