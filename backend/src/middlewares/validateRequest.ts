import { getAuth, AuthObject } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);

  if (!auth.sessionId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  (req as Request & { auth: AuthObject }).auth = auth;

  next();
};
