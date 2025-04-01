import { getAuth, AuthObject } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  if (!auth.sessionId) {
    res.status(401).json({ Messages: "Unauthorized" });
  }
  (req as Request & { auth: AuthObject }).auth = auth;

  next();
};
