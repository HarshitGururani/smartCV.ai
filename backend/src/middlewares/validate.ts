import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  };
