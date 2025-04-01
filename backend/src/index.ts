import express, { Request, Response, Router } from "express";
import cors from "cors";
import { clerkMiddleware, AuthObject } from "@clerk/express";
import "dotenv/config";
import { validateRequest } from "./middlewares/validateRequest";
import documentRoute from "./routes/document";

const app = express();
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body (optional)
const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "https://smart-cv-ai-pi.vercel.app", // Production frontend
  "https://smartcvai-production.up.railway.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
// Update your Clerk middleware with authorizedParties
app.use(
  clerkMiddleware({
    authorizedParties: [
      "https://smart-cv-ai-pi.vercel.app", // Production frontend
      "https://smartcvai-production.up.railway.app",
    ],
  })
);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "test data" });
});

app.use("/api/document", documentRoute);

app.get("/", validateRequest, (req: Request, res: Response) => {
  const auth = (req as Request & { auth: AuthObject }).auth;

  res.status(200).json({ message: auth });
});

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
