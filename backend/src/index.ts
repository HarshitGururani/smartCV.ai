import express, { Request, Response, Router } from "express";
import cors from "cors";
import {
  clerkMiddleware,
  requireAuth,
  getAuth,
  AuthObject,
} from "@clerk/express";
import "dotenv/config";
import { validateRequest } from "./middlewares/validateRequest";
import documentRoute from "./routes/document";

const app = express();
const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "https://smart-cv-ai-pi.vercel.app", // Production frontend
];

app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body (optional)

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(clerkMiddleware());

app.use("/api/document", documentRoute);

app.get("/", validateRequest, (req: Request, res: Response) => {
  const auth = (req as Request & { auth: AuthObject }).auth;

  res.status(200).json({ message: auth });
});

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
